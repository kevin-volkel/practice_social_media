import moment from 'moment'
import Moment from 'react-moment'

const calculateTime = (createdAt) => {
  const today = moment(Date.now())
  const postDate = moment(createdAt)
  const diffInHours = today.diff(postDate, 'hours')

  if(diffInHours < 48) {
    return <>
      {diffInHours < 24 ? 'Today' : 'Yesterday'} At <Moment format='hh:mm A'>{createdAt}</Moment>
    </>
  } else {
    return <Moment format="MM/DD/YYYY hh:mm A">{createdAt}</Moment>
  }
}

export default calculateTime;