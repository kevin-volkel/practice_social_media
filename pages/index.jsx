import { useEffect } from 'react'
import { parseCookies } from 'nookies'
import { baseURL } from './util/auth'

const index = ({user}) => {

  //* UseEffects

  useEffect( () => {
    document.title = `Welcome ${user.name.split(' ')[0]}`
  }, [])

  return <div> Homepage </div>
}

index.getInitialProps = async (ctx) => {
  try {
    const token = parseCookies(ctx)
    const res = await axios.get(`${baseURL}/api/v1/posts`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    return {postData: res.data}
  } catch (err) {
    console.error(err)
  }
}


export default index

// const index = ({ posts, token }) => {
//   return <>
//     <h1>{token}</h1>
//     {posts.map( (post) => {
//       return <div key={post.id}>
//         <h1>{post.title}</h1>
//         <p>{post.body}</p>
//         <Divider />
//       </div>
//     })}
//   </>
// }

// index.getInitialProps = async (ctx) => {
//   const cookie = parseCookies(ctx)
//   const res = await axios.get('https://jsonplaceholder.typicode.com/posts')
//   // console.log(ctx);
//   return { posts: res.data, token: cookie.token };
// }
