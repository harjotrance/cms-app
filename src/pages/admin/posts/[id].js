import PostForm from '../../../../components/PostForm';

const AdminEditPost = ({ query }) => {
  const { id } = query;
  return (
    <div>
      <h1>Edit Post</h1>
      <PostForm postId={id} />
    </div>
  );
};

AdminEditPost.getInitialProps = ({ query }) => {
  return { query };
};

export default AdminEditPost;