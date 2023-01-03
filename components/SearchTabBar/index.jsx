import React, { useState } from "react";
import styled from "styled-components";
import { getItemsNameByQuery } from "../../firebase";
import { Input } from "../uiElements";
const SearchTabBar = () => {
  const [input, setInput] = useState("");

  function handleChange(e) {
    //have to change the value in the DB to lowercase
    setInput(e.target.value.toLowerCase());
  }
  function submit(e) {
    e.preventDefault();
    getItemsNameByQuery(input);
  }

  return (
    <FormWrapper>
      <FormBackground>
        <Input
          input={input}
          handleChange={handleChange}
          submit={submit}
          placeholder="search company's name"
          autocomplete="off"
        />
      </FormBackground>
    </FormWrapper>
  );
};

const FormWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;
const FormBackground = styled.div`
  padding: 12px;
  background: #fff;
  border: 1px solid #dddddd;
  border-radius: 8px;
  input {
    border: 0;
    font-size: 16px;
    overflow: hidden;
    padding: 10px 12px;
    transition-duration: 0.3s;
    transition-property: color;
    text-overflow: ellipsis;
    z-index: 1;
    margin: auto;
    width: 100%;
    border-radius: 8px;

    &:focus {
      box-shadow: none;
      border: none;
      outline: none;
    }
  }
`;

export default SearchTabBar;
