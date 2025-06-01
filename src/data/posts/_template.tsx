import { BlogPost } from '../../types/blog';

const post: BlogPost = {
  slug: 'your-post-slug',
  title: 'Your Blog Post Title',
  description: 'A brief description of your post for the blog index',
  date: '2024-12-08',
  readingTime: 5,
  tags: ['Tag1', 'Tag2', 'Tag3'],
  content: (
    <>
      <p>
        Your introduction paragraph goes here.
      </p>

      <h2>Main Section Title</h2>
      <p>
        Content for your main section.
      </p>

      <h3>Subsection Title</h3>
      <p>
        Content for subsections.
      </p>

      {/* Code blocks */}
      <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded overflow-x-auto">
        <code>{`// Your code example here
const example = "Hello, World!";
console.log(example);`}</code>
      </pre>

      {/* Lists */}
      <ul>
        <li>Unordered list item 1</li>
        <li>Unordered list item 2</li>
      </ul>

      <ol>
        <li>Ordered list item 1</li>
        <li>Ordered list item 2</li>
      </ol>

      {/* Links */}
      <p>
        Check out <a href="https://example.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">this link</a> for more information.
      </p>

      {/* Images (if needed) */}
      {/* <img src="/images/blog/your-image.jpg" alt="Description" className="my-4 rounded" /> */}

      <h2>Conclusion</h2>
      <p>
        Wrap up your post with a conclusion.
      </p>
    </>
  )
};

export default post; 