import { motion } from "framer-motion";

export default function App() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.5 }}
        className="p-8 bg-white shadow-lg rounded-lg"
      >
        <img src="/images/logo.png" alt="Logo" className="w-32 h-32 mx-auto mb-4" />
        <h1 className="text-2xl font-bold text-center">Hello, Framer Motion!</h1>
      </motion.div>
    </div>
  );
}
