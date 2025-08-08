import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from '../utils/axiosInstance';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from 'framer-motion';

const BlogDetailPage = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`/api/blogs/getall`);
        const found = res.data.data.find((b) => b._id === id);
        setBlog(found);
      } catch (err) {
        console.error('Failed to load blog:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading)
    return <p className="text-center py-10 text-gray-500">Loading blog...</p>;
  if (!blog)
    return <p className="text-center py-10 text-red-500">Blog not found.</p>;

  return (
    <>
      <Navbar />

      <div className="max-w-full mx-auto w-full mt-15 sm:mt-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-white shadow-md rounded-xl overflow-hidden p-4 sm:p-6"
        >
          <div className="flex flex-col md:flex-row gap-8">
            {/* Left: Image + Title + Date */}
            <div className="md:w-1/3 flex flex-col">
              {blog.image && (
                <motion.img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full rounded-lg h-auto object-cover max-h-[300px]"
                  initial={{ scale: 1.05, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.8 }}
                />
              )}
              <div className="mt-6">
                <motion.h1
                  className="text-xl sm:text-2xl font-bold text-red-600 mb-2 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  {(blog.title).toUpperCase()}
                </motion.h1>

                <motion.p
                  className="text-xs text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Published on:{" "}
                  <span className="font-medium">
                    {new Date(blog.createdAt).toLocaleDateString()}
                  </span>
                </motion.p>
              </div>
            </div>

            {/* Right: Description */}
            <motion.div
              className="md:w-2/3 space-y-4 text-gray-700 text-sm sm:text-base leading-relaxed"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.15
                  }
                }
              }}
            >
              {(blog.description || "")
                .split('\n')
                .filter((para) => para.trim() !== "")
                .map((para, idx) => (
                  <motion.p
                    key={idx}
                    className="break-words whitespace-pre-wrap text-justify"
                    variants={{
                      hidden: { opacity: 0, y: 20 },
                      visible: { opacity: 1, y: 0 }
                    }}
                  >
                    {para}
                  </motion.p>
                ))}
            </motion.div>
          </div>
        </motion.div>
      </div>

      <div className="mt-10 flex justify-center">
        <a
          href="/blogs"
          className="bg-red-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow hover:bg-red-700 transition"
        >
          See more post
        </a>
      </div>


      <Footer />
    </>
  );
};

export default BlogDetailPage;
