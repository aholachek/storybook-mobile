import React from 'react'
import styled from 'styled-components'
import { InfoSignIcon } from 'evergreen-ui'

const InvisibleButton = styled.button`
  font-family: inherit;
  color: inherit;
  cursor: pointer;
  border: none;
  font-size: 100%;
  background-color: transparent;
  appearance: none;
  box-shadow: none;
  margin: 1rem;
  -webkit-tap-highlight-color: hsla(0, 0%, 0%, 0);
`
const IconButton = () => (
  <InvisibleButton>
    <InfoSignIcon color="info" />
  </InvisibleButton>
)

export const Default = () => <IconButton />

export default {
  title: 'Icon Button',
  component: IconButton,
}
