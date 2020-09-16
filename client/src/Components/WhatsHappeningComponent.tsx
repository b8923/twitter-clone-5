import React, { useState } from "react";
import {
  ButtonsSection,
  TwitterLogo,
  ButtonsTitle,
  JoinTitle,
  SignUpButton,
  LogInButton,
} from "../Style/ComponentStyles/RegisterPageStyles";
import Logo from "../Images/Twitter_Logo_WhiteOnImage.svg";
import { useHistory } from "react-router-dom";
import Modal from "./Modal";
const WhatsHappening = () => {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  const history = useHistory();
  return (
    <ButtonsSection>
      <TwitterLogo src={Logo} />
      <ButtonsTitle>See what’s happening in the world right now</ButtonsTitle>
      <JoinTitle>Join Twitter today.</JoinTitle>
      <SignUpButton onClick={() => setIsOpen(true)}>Sign up</SignUpButton>
      {isOpen && (
        <Modal open={isOpen} closeModal={closeModal}>
          Modal
        </Modal>
      )}
      <LogInButton onClick={() => history.push("/login")}>Log in</LogInButton>
    </ButtonsSection>
  );
};

export default WhatsHappening;
