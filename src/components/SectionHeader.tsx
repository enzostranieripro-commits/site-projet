import { motion } from "framer-motion";

interface SectionHeaderProps {
  label: string;
  title: string;
  highlight?: string;
  description?: string;
}

const SectionHeader = ({ label, title, highlight, description }: SectionHeaderProps) => (
  <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center mb-16">
    <span className="section-label mb-4 inline-block">{label}</span>
    <h2 className="text-3xl md:text-5xl font-extrabold leading-tight mt-4">
      {title}{" "}{highlight && <span className="text-gradient">{highlight}</span>}
    </h2>
    {description && <p className="text-muted-foreground text-lg max-w-2xl mx-auto mt-4">{description}</p>}
  </motion.div>
);

export default SectionHeader;
