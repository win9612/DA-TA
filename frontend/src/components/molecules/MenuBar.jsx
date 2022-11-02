/**
 * @author boyeon
 */
/**
 *
 */
import React from "react";
import { useState } from "react";
import styled from "styled-components";
import { MypageMenu } from "../atoms/MypageMenu";

export const MenuBar = () => {
  let [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <MenuBarDiv>
      {[0, 1, 2].map((a, i) => (
        <MypageMenu
          menuIndex={a}
          selectedIndex={selectedIndex}
          key={i}
          onClick={() => {
            setSelectedIndex(a);
          }}
        ></MypageMenu>
      ))}
    </MenuBarDiv>
  );
};

const MenuBarDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 200px;
  height: 536px;
  background-color: #f5f5f5;
  border-right: 2px solid gray;
`;