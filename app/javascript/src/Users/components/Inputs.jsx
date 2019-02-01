// @flow

import * as React from 'react'

type Props = {
  name: string,
  children?: React.Node
}

const Inputs = (props: Props) => (
  <fieldset className='inputs' name={props.name}>
    <legend><span>{props.name}</span></legend>
    <ol>{props.children}</ol>
  </fieldset>
)

export { Inputs }
