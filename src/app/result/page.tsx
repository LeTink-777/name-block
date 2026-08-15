'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Lock, Check, Hammer, KeyRound, ArrowRight, Lightbulb } from 'lucide-react';
import { PLANS, STORAGE_KEY, nameNumber, getBlock, SITE, type Block } from '@/lib/content';
import type { PlanId, UserData } from '@/lib/types';

// Трещины нарастают от тарифа к тарифу.
const CRACKS = [
  ['M120 4 L110 30 L124 52'],
  ['M120 4 L110 30 L124 52 L108 68', 'M110 30 L78 44', 'M124 52 L154 62'],
  [
    'M120 4 L110 30 L124 52 L108 68',
    'M110 30 L70 42',
    'M124 52 L166 60',
    'M60 0 L74 26 L58 46 L70 68',
    'M180 2 L168 28 L184 50 L172 68',
  ],
];

export default function ResultPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [num, setNum] = useState<number | null>(null);
  const [block, setBlock] = useState<Block | null>(null);
  const [paying, setPaying] = useState<PlanId | null>(null);
  const [payError, setPayError] = useState('');

  useEffect(() => {
    let data: UserData = {};
    try {
      data = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') as UserData;
    } catch {
      data = {};
    }
    const n = nameNumber(data.name || '');
    const b = n ? getBlock(n) : null;
    if (!n || !b) {
      router.replace('/');
      return;
    }
    setUser(data);
    setNum(n);
    setBlock(b);
  }, [router]);

  const pay = async (plan: PlanId) => {
    if (!user) return;
    setPaying(plan);
    setPayError('');
    localStorage.setItem('selected_plan', plan);
    try {
      const res = await fetch('/api/create-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, userData: user }),
      });
      const data = await res.json();
      if (data?.confirmationUrl) {
        window.location.href = data.confirmationUrl;
        return;
      }
      setPayError(data?.error || 'Не удалось создать платёж. Попробуйте ещё раз.');
    } catch {
      setPayError('Сервис оплаты временно недоступен. Попробуйте через минуту.');
    }
    setPaying(null);
  };

  if (!user || !block || !num) {
    return (
      <main className="shell" style={{ padding: '120px 20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Считаем число имени...</p>
      </main>
    );
  }

  return (
    <>
      <main className="shell" style={{ paddingTop: 48 }}>
        <motion.section
          className="neon-panel"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="neon-number"
            initial={{ opacity: 0.2 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {num}
          </motion.div>
          <p className="neon-caption">
            Число имени {user.name}
            {num === 11 || num === 22 ? ' · мастер-число' : ''}
          </p>
          <h1 className="neon-block">{block.name}</h1>
          <p className="neon-short">{block.short}</p>
        </motion.section>

        <div className="rule">
          <Hammer size={17} strokeWidth={2} />
        </div>

        <section className="narrow">
          <div className="lock-stack">
            <div className="lock-veil">
              <Lock size={26} strokeWidth={1.8} color="var(--accent)" />
              <h3>Стена ещё стоит</h3>
              <p>
                Как блок проявляется, откуда он взялся, три шага, чтобы его убрать, и
                аффирмация — за стеной ниже.
              </p>
            </div>

            <div className="locked-blur" aria-hidden="true">
              <div className="info-card">
                <h3>
                  <Hammer size={17} strokeWidth={2} />
                  Как блок проявляется
                </h3>
                <p>{block.manifestations}</p>
              </div>
              <div className="info-card">
                <h3>
                  <KeyRound size={17} strokeWidth={2} />
                  Корень блока
                </h3>
                <p>{block.root}</p>
              </div>
              <div className="info-card">
                <h3>
                  <Lightbulb size={17} strokeWidth={2} />
                  Три шага, чтобы убрать блок
                </h3>
                <p>{block.steps}</p>
              </div>
            </div>
          </div>
        </section>

        <div className="rule">
          <Hammer size={17} strokeWidth={2} />
        </div>

        <section>
          <h2 className="section-title">Сломайте стену</h2>
          <p className="section-lead">
            Чем сильнее удар, тем больше открывается: от описания блока до 30-дневной
            программы его снятия.
          </p>

          <div className="walls">
            {PLANS.map((plan, index) => {
              const discount = Math.round((1 - plan.price / plan.oldPrice) * 100);
              return (
                <div
                  key={plan.id}
                  className="wall"
                  data-featured={plan.featured ? 'true' : 'false'}
                >
                  {plan.featured ? <span className="wall-badge">Выбор большинства</span> : null}

                  <div className="wall-visual" aria-hidden="true">
                    <svg viewBox="0 0 240 68" preserveAspectRatio="none">
                      {CRACKS[index].map((d, i) => (
                        <motion.path
                          className="crack"
                          key={i}
                          d={d}
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.7, delay: 0.1 * i }}
                        />
                      ))}
                    </svg>
                  </div>

                  <h3>{plan.name}</h3>
                  <p className="wall-tagline">{plan.tagline}</p>

                  <div className="wall-price">
                    <span className="now">{plan.price} ₽</span>
                    <span className="was">{plan.oldPrice} ₽</span>
                    <span className="off">−{discount}%</span>
                  </div>

                  <ul className="wall-features">
                    {plan.features.map((f) => (
                      <li key={f}>
                        <Check size={15} strokeWidth={2.4} />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <button
                    className="wall-cta"
                    disabled={paying !== null}
                    onClick={() => pay(plan.id)}
                  >
                    {paying === plan.id ? (
                      'Открываем оплату...'
                    ) : (
                      <>
                        Ударить по стене
                        <ArrowRight size={16} strokeWidth={2} />
                      </>
                    )}
                  </button>
                </div>
              );
            })}
          </div>

          {payError ? (
            <p className="field-error" style={{ textAlign: 'center', marginTop: 20 }}>
              {payError}
            </p>
          ) : null}

          <p
            style={{
              textAlign: 'center',
              marginTop: 26,
              fontSize: 13.5,
              color: 'var(--text-secondary)',
            }}
          >
            Оплата через ЮKassa. Доступны карты, СБП, кошельки и рассрочка.
            <br />
            Разбор открывается сразу после оплаты и дублируется на почту.
          </p>
        </section>
      </main>

      <footer className="site-foot shell">
        <p>
          <Link href="/privacy">Политика конфиденциальности</Link>
          <Link href="/offer">Публичная оферта</Link>
        </p>
        <p>
          Евдокимов Даниил Владимирович · ИНН 381928138362 · Самозанятый
          <br />
          danyavdkmvv3@gmail.com · @dvdkmv
        </p>
        <p className="disclaimer">
          {SITE.name} — развлекательный сервис. Материалы не являются финансовой
          консультацией.
        </p>
      </footer>
    </>
  );
}
