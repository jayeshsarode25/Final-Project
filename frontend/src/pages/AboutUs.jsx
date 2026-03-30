import { useEffect, useRef, useState } from 'react';
import Card from '../components/ui/Card';
import { Shield, Zap, Heart, Award, Globe } from 'lucide-react';

function AnimatedCounter({ end, duration = 2000, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true;
        const startTime = performance.now();
        const animate = (now) => {
          const progress = Math.min((now - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setCount(Math.floor(eased * end));
          if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

export default function AboutUs() {
  return (
    <div className="mh-bg-primary">
      {/* Hero */}
      <section className="relative py-16 sm:py-20 lg:py-28 text-center overflow-hidden" style={{ background: 'var(--accent-gradient)' }}>
        <div className="absolute inset-0 bg-black/25" />
        <div className="relative max-w-3xl mx-auto px-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white mb-3 sm:mb-4 animate-fade-in-up">About MarketHub</h1>
          <p className="text-sm sm:text-base lg:text-lg text-white/80 animate-fade-in-up max-w-xl mx-auto" style={{ animationDelay: '0.1s' }}>
            We're on a mission to make online shopping smarter, faster, and more personal — powered by cutting-edge technology and AI.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-10 sm:py-16 mh-bg-secondary">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 text-center stagger-children">
          {[
            { value: 10000, suffix: '+', label: 'Products' },
            { value: 50000, suffix: '+', label: 'Happy Customers' },
            { value: 500, suffix: '+', label: 'Sellers' },
            { value: 99, suffix: '%', label: 'Satisfaction' },
          ].map((stat) => (
            <div key={stat.label} className="animate-fade-in">
              <p className="text-2xl sm:text-3xl lg:text-4xl font-extrabold gradient-text">
                <AnimatedCounter end={stat.value} suffix={stat.suffix} />
              </p>
              <p className="text-xs sm:text-sm mt-1 mh-text-secondary">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-10 sm:py-16 mh-bg-primary">
        <div className="max-w-5xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {[
            { title: 'Our Mission', desc: 'To democratize e-commerce by connecting buyers with the best products at the best prices, while empowering sellers to reach a global audience.', icon: <Zap size={24} /> },
            { title: 'Our Vision', desc: 'A world where AI-powered shopping assistance makes every purchase decision effortless, informed, and delightful.', icon: <Globe size={24} /> },
          ].map((item) => (
            <div key={item.title} className="mh-card p-5 sm:p-6 animate-fade-in-up">
              <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center mb-3 sm:mb-4 text-white" style={{ background: 'var(--accent-gradient)' }}>
                {item.icon}
              </div>
              <h3 className="text-base sm:text-lg font-bold mb-2 mh-text-primary">{item.title}</h3>
              <p className="text-xs sm:text-sm leading-relaxed mh-text-secondary">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-10 sm:py-16 mh-bg-secondary">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-center mb-8 sm:mb-10 mh-text-primary">Our Values</h2>
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5 stagger-children">
            {[
              { icon: <Shield size={22} />, title: 'Trust', desc: 'Secure payments and verified sellers' },
              { icon: <Heart size={22} />, title: 'Customer First', desc: 'Every decision starts with you' },
              { icon: <Zap size={22} />, title: 'Innovation', desc: 'AI-powered shopping experience' },
              { icon: <Award size={22} />, title: 'Quality', desc: 'Curated products, zero compromise' },
            ].map((v) => (
              <Card key={v.title} className="!p-4 sm:!p-5 text-center animate-fade-in">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center mh-accent-subtle-bg mh-text-accent">{v.icon}</div>
                <h4 className="font-semibold text-xs sm:text-sm mb-1 mh-text-primary">{v.title}</h4>
                <p className="text-[10px] sm:text-xs mh-text-tertiary">{v.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-10 sm:py-16 mh-bg-primary">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-8 sm:mb-10 mh-text-primary">Meet the Team</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-5 stagger-children">
            {[
              { name: 'Jayesh S.', role: 'Founder & Developer' },
              { name: 'AI Buddy', role: 'Shopping Assistant' },
              { name: 'Team Dev', role: 'Backend Engineers' },
              { name: 'Community', role: 'Our Users ❤️' },
            ].map((member, i) => (
              <Card key={i} className="!p-4 sm:!p-5 text-center animate-fade-in">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full mx-auto mb-2 sm:mb-3 flex items-center justify-center text-base sm:text-xl font-bold text-white"
                  style={{ background: 'var(--accent-gradient)' }}>
                  {member.name.charAt(0)}
                </div>
                <h4 className="font-semibold text-xs sm:text-sm mh-text-primary">{member.name}</h4>
                <p className="text-[10px] sm:text-xs mh-text-tertiary">{member.role}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}