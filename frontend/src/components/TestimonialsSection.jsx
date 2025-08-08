import React from 'react';
import { FaStar, FaQuoteLeft } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import 'swiper/css';
import 'swiper/css/navigation';

const testimonials = [
  {
    name: 'Vikki Starr',
    date: 'January 15, 2023',
    rating: 5,
    text: 'Absolutely love TopShelfBC; affordable on any budget and such fast delivery, straight to my door!',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg'
  },
  {
    name: 'Terry Baskey',
    date: 'January 5, 2023',
    rating: 5,
    text: 'Best damn place to buy your cannabis at great prices.',
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg'
  },
  {
    name: 'Terry Bob',
    date: 'January 5, 2023',
    rating: 5,
    text: 'Exceptional service and quality. Highly recommended!',
    avatar: 'https://randomuser.me/api/portraits/men/30.jpg'
  },
  {
    name: 'Alice Green',
    date: 'February 2, 2023',
    rating: 4,
    text: 'Fast shipping and great quality. Will buy again.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg'
  },
  {
    name: 'John Doe',
    date: 'March 10, 2023',
    rating: 5,
    text: 'The best online dispensary experience I’ve had so far!',
    avatar: 'https://randomuser.me/api/portraits/men/23.jpg'
  }
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 px-4 sm:px-6 md:px-20 bg-gradient-to-br from-gray-50 via-white to-gray-100 overflow-hidden">
      {/* Heading */}
      <motion.h2
        className="text-2xl sm:text-3xl font-bold mb-12 text-gray-800 text-center md:text-left"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        CUSTOMER TESTIMONIALS
      </motion.h2>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-stretch">
        {/* red Rating Box */}
        <motion.div
          className="bg-red-900 text-white rounded-xl p-6 flex flex-col justify-between shadow-md"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div>
            <h3 className="text-lg font-semibold mb-6 leading-snug">
              VOTED BEST ONLINE DISPENSARY IN CANADA
            </h3>
            <p className="text-gray-200 mb-6">Google</p>
          </div>
          <div>
            <p className="uppercase text-sm mb-1">Excellent</p>
            <div className="flex items-center gap-1 text-yellow-400 mb-2">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} />
              ))}
            </div>
            <p className="text-xs text-gray-300">
              on <span className="underline">115 Reviews</span>
            </p>
          </div>
        </motion.div>

        {/* Testimonial Slider */}
        <motion.div
          className="lg:col-span-3"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true
            }}
            loop={true}
            spaceBetween={24}
            breakpoints={{
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 }
            }}
          >
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <motion.div
                  className="bg-white rounded-xl shadow p-6 h-full flex flex-col justify-between transition-transform hover:scale-[1.03] hover:shadow-lg duration-300"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.1 }}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="w-10 h-10 rounded-full mr-3 transition-transform duration-300 hover:scale-105 hover:rotate-2"
                    />
                    <h4 className="font-semibold text-gray-800">{t.name}</h4>
                  </div>

                  <div className="flex text-yellow-500 mb-2">
                    {[...Array(t.rating)].map((_, idx) => (
                      <FaStar key={idx} size={16} />
                    ))}
                  </div>

                  <div className="relative">
                    <FaQuoteLeft className="absolute text-gray-200 top-2 left-2 text-lg z-0" />
                    <p className="text-sm text-gray-700 mb-4 leading-relaxed relative z-10">
                      {t.text}
                    </p>
                  </div>

                  <p className="text-xs text-gray-400 mt-auto">{t.date}</p>
                </motion.div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
