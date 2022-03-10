import React from 'react'
import { Segment, Grid, Image } from 'semantic-ui-react'

const Banner = ({ bannerData }) => {
  const {name, profilePicURL} = bannerData;

  return (
    <Segment color="orange" attached="top">
      <Grid>
        <Grid.Column floated="left" width={14}>
          <h4>
            <Image avatar src={profilePicURL}/>
            {name}
          </h4>
        </Grid.Column>
      </Grid>
    </Segment>
  )
}

export default Banner