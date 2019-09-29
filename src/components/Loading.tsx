import React from "react"
import styled from "styled-components"
import checkmarkPng from "../assets/checkmark@2x.png"

const options = {
  baseLineHeight: "16px",
  strokeColor: "rgba(0,0,0,0.7)",
  bgColor: "rgba(0,0,0,0.2)",
  spinDuration: "1s",
}

const Loader = styled.div`
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  display: block;
  width: 18px;
  height: 20px;
`

const Spinner = styled.span`
  display: block;
  border-radius: 50%;
  width: ${options.baseLineHeight};
  height: ${options.baseLineHeight};
  border: .15rem solid ${options.bgColor};
  border-top-color: ${options.strokeColor};
  animation: spin ${options.spinDuration} infinite linear;
  margin: 0 auto;
`

const CheckmarkImage = styled.img`
  display: block;
  width: 18px;
  height: 14px;
`

const Checkmark = styled.span`
  padding-top: 3px;
  display: block;
  width: 18px;
  height: 14px;
`

export default ({ isLoading }: { isLoading: boolean }) => (
  <Loader>
    { isLoading ?
      <Spinner />
      :
      <Checkmark>
        <CheckmarkImage src={checkmarkPng} width="18" />
      </Checkmark>
    }
  </Loader>
)
