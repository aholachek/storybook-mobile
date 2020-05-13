import React from 'react'
import styled from 'styled-components'
import { TextInputField, Heading, Text, Button } from 'evergreen-ui'
import background from './background.jpg'

const Container = styled.div`
  > div:first-of-type {
    height: 30vh;
    overflow: hidden;
  }
  background-image: url(${background});
  background-size: cover;
  height: 60vh;

  h1 {
    position: absolute;
    top: 4rem;
    font-weight: bold;
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
  }
`

const Form = styled.form`
  background-color: white;
  border-radius: 6px;
  padding: 1.5rem;
  position: relative;
  margin-left: 1rem;
  margin-right: 1rem;
  max-width: 600px;
  top: -2rem;
  box-shadow: 0 2px 20px hsla(0, 0%, 0%, 0.16);
  > div:last-of-type {
    display: flex;
    justify-content: flex-end;
  }
  margin-bottom: 2rem;
`

const AboutForm = () => {
  return (
    <Container>
      <div>
        <Heading color="white" size={900} is="h1">
          Sign Up
        </Heading>
      </div>
      <Form>
        <TextInputField label="Email" />
        <TextInputField label="Password" type="password" />
        <TextInputField label="Name" />
        <TextInputField label="Telephone" />
        <TextInputField label="Age" type="number" />
        <TextInputField label="Blood type" />

        <div style={{ marginBottom: '1rem' }}>
          <Button appearance="primary" type="submit">
            Submit{' '}
          </Button>
          <Button type="reset">Clear</Button>
        </div>

        <Text size={300}>
          By filling out this form you acknowledge that we have full rights to
          your data forever and ever.
        </Text>
      </Form>
    </Container>
  )
}

export default AboutForm
