import React, { ChangeEvent, useCallback, useState } from "react";
import { useRootStore } from "../../Store/RootStore";
import DefaultImage from "../../Images/default_profile_400x400.png";
import Emoji from "./Emoji";
import {
  Avatar,
  Button,
  IconWrapper,
  ImageButton,
  ImageButtonWrapper,
  TextArea,
  TweetForm,
  Wrapper,
  Gif,
  ButtonWrapper,
} from "../../Style/ComponentStyles/TweetInputStyles";
import { useDropzone } from "react-dropzone";
import Images from "../Images";
import Axios from "../../utils/Axios";
import { postTweetURL } from "../../utils/Urls";
import GifPicker from "./GifPicker";
import { useObserver } from "mobx-react-lite";
interface Props {
  setTweets: React.Dispatch<any[]>;
  tweets: any[];
}
const TweetInput: React.FC<Props> = ({ setTweets, tweets }): any => {
  const { userStore } = useRootStore();
  const [description, setDescription] = useState("");
  const [files, setFiles] = useState<any>([]);
  const [filesToSend, setFilesToSend] = useState<any[]>([]);
  const [gif, setGif] = useState("");
  const onDrop = useCallback(
    ([file]) => {
      const reader = new FileReader();
      setFilesToSend([file, ...filesToSend]);
      reader.onload = () => {
        const binaryStr = reader.result;
        setFiles([
          {
            buffer: Buffer.from(binaryStr as ArrayBuffer),
            originalname: file.name,
            mimetype: file.type,
            path: file.path,
          },
          ...files,
        ]);
      };
      reader.readAsArrayBuffer(file);
    },
    [files, filesToSend]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/png, img/jpeg",
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!description) return;
    
    const dataToSend = new FormData();

    description.match(/#(\w)+/g)?.forEach((word) => {
      dataToSend.append("tags", word);
    });

    if (dataToSend.getAll("tags").length === 0) dataToSend.append("tags", "");

    filesToSend.forEach((file) => {
      dataToSend.append("tweetImages", file);
    });

    dataToSend.append("gif", gif);

    dataToSend.append("message", description);

    try {
      const response = await Axios.post(
        postTweetURL,
        dataToSend,
        userStore.setFormDataConfig()
      );
      console.log(response);
      setTweets([response.data, ...tweets]);
      setFilesToSend([]);
      setFiles([]);
      setDescription("");
      setGif("");
    } catch (error) {}
  };
  return useObserver(() => {
    return (
      <>
        <TweetForm
          onSubmit={(e: React.FormEvent<HTMLFormElement>) => handleSubmit(e)}
        >
          <Wrapper>
            <Avatar
              src={
                userStore.userData?.avatar
                  ? userStore.userData.avatar.url
                  : DefaultImage
              }
            />
            <TextArea
              name="description"
              value={description}
              onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              placeholder="What's happening"
            />
          </Wrapper>
          <Images files={files} />
          <div style={{ padding: "0.5rem 2rem" }}>
            {gif && <Gif src={gif} alt="gif" onClick={() => setGif("")} />}
          </div>
          <IconWrapper>
            <div style={{ display: "flex" }}>
              <Emoji setDescription={setDescription} />
              <ImageButtonWrapper {...getRootProps()}>
                <input {...getInputProps()} disabled={gif ? true : false} />
                <ButtonWrapper type="button">
                  <ImageButton fontSize={28} />
                </ButtonWrapper>
              </ImageButtonWrapper>
              <GifPicker setGif={setGif} />
            </div>
            <Button type="submit" disabled={description ? false : true}>
              Tweet
            </Button>
          </IconWrapper>
        </TweetForm>
      </>
    );
  });
};

export default TweetInput;