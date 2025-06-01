import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { usePageTitle } from '../hooks/usePageTitle';
import { FadeInSection } from '../utils/FadeInSection';
import { blogPosts } from '../data/blogPosts';

interface BlogItem {
  title: string;
  description?: string;
  link: string;
  date: string; // ISO date string
  isInternal: boolean;
  tags?: string[];
  readingTime?: number;
}

const Blog = () => {
  usePageTitle('Blog');
  
  // External blog items (if you still want to keep some external links)
  const externalBlogList: BlogItem[] = [
    // You can add external blog links here if needed
  ];

  // Combine internal and external posts
  const allPosts = [
    ...blogPosts.map(post => ({
      title: post.title,
      description: post.description,
      link: `/blog/${post.slug}`,
      date: post.date,
      isInternal: true,
      tags: post.tags,
      readingTime: post.readingTime
    })),
    ...externalBlogList
  ];

  // Sort all posts by date in descending order (newest first)
  const sortedBlogList = allPosts.sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="space-y-6">
        {sortedBlogList.map((item, index) => (
          <FadeInSection key={item.title} delay={index * 0.2}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1 }}
              transition={{
                duration: 0.3,
                delay: index * 0.1
              }}
            >
              {item.isInternal ? (
                <Link
                  to={item.link}
                  className="block"
                >
                  <div className="p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex justify-between items-start">
                      {/* Content */}
                      <div className="flex-grow pr-6">
                        <h2 className="blog-title">{item.title}</h2>
                        {item.description && (
                          <p className="blog-description">
                            {item.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mt-2">
                          <p className="blog-date">
                            {new Date(item.date).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                          {item.readingTime && (
                            <>
                              <span>•</span>
                              <span>{item.readingTime} min read</span>
                            </>
                          )}
                        </div>
                        {item.tags && item.tags.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.tags.slice(0, 3).map(tag => (
                              <span
                                key={tag}
                                className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Arrow Icon for internal links */}
                      <div className="text-gray-400 pt-1">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5"
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M9 5l7 7-7 7" 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ) : (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <div className="p-6 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <div className="flex justify-between items-start">
                      {/* Content */}
                      <div className="flex-grow pr-6">
                        <h2 className="blog-title">{item.title}</h2>
                        {item.description && (
                          <p className="blog-description">
                            {item.description}
                          </p>
                        )}
                        <p className="blog-date">
                          {new Date(item.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>

                      {/* External Link Icon */}
                      <div className="text-gray-400 pt-1">
                        <svg 
                          xmlns="http://www.w3.org/2000/svg" 
                          className="h-5 w-5"
                          fill="none" 
                          viewBox="0 0 24 24" 
                          stroke="currentColor"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2} 
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" 
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </a>
              )}
            </motion.div>
          </FadeInSection>
        ))}
      </div>
    </div>
  );
};

export default Blog; 