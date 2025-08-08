import React from 'react';
import { motion } from 'framer-motion';
import {
  FaHeadset,
  FaShieldAlt,
  FaGem,
  FaTruck,
  FaLeaf,
  FaHandshake
} from 'react-icons/fa';

const features = [
  {
    icon: <FaHeadset size={30} className="text-red-600" />,
    title: 'Customer Service',
    description:
      'Whether it is answering any questions you have before making a purchase, helping you out with the buying process itself or taking your feedback under consideration, we are proud to provide high quality customer service that makes you – the customer – the most important person in the transaction.'
  },
  {
    icon: <FaShieldAlt size={30} className="text-red-600" />,
    title: 'Security',
    description:
      'We only keep necessary details for orders and use tamper-proof and discrete packaging for your privacy.'
  },
  {
    icon: <FaGem size={30} className="text-red-600" />,
    title: 'Best Value',
    description:
      'We continuously adjust our supply and pricing to ensure the perfect mix of affordability and quality.'
  },
  {
    icon: <FaTruck size={30} className="text-red-600" />,
    title: 'Delivery Insurance',
    description:
      'Lost, stolen, or damaged orders are replaced for free. We also offer free express shipping over ₹120.'
  },
  {
    icon: <FaLeaf size={30} className="text-red-600" />,
    title: 'Highest Quality',
    description:
      'We test all products and work with expert growers to maintain top quality for every order.'
  },
  {
    icon: <FaHandshake size={30} className="text-red-600" />,
    title: 'Trust',
    description:
      'With over 15 years in the cannabis industry, we value customer satisfaction and long-term trust.'
  }
];

// Motion variants for staggered card animation
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.2
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 40, scale: 0.95 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: 'easeOut'
    }
  }
};

const WhyUsSection = () => {
  return (
    <section className="bg-white py-14 px-4 sm:px-6 md:px-20">
      <motion.h2
        className="text-3xl sm:text-4xl md:text-5xl font-bold text-start mb-4"
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        WHAT MAKES US THE <span className="text-yellow-500">#1</span> ONLINE MARIJUANA DISPENSARY IN CANADA?
      </motion.h2>

      <motion.p
        className="text-start max-w-3xl mx-0.5 text-gray-600 mb-12 text-sm sm:text-base"
        initial={{ opacity: 0, y: 10 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        When it comes to what makes us the foremost{' '}
        <a href="#" className="text-blue-600 underline">
          online marijuana dispensary in Canada
        </a>
        , we could wax lyrical about our positive qualities. Instead, we’ve
        highlighted the six prioritized features that set us apart.
      </motion.p>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-white p-6 rounded-lg shadow hover:shadow-xl transition hover:-translate-y-1 hover:scale-105"
            variants={cardVariants}
          >
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-lg font-semibold mb-2 text-gray-800">
              {feature.title}
            </h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default WhyUsSection;
