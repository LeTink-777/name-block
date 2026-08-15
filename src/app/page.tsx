'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Hash, KeyRound, ArrowRight } from 'lucide-react';
import { nameNumber, STORAGE_KEY, SITE } from '@/lib/content';

export default function HomePage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (nameNumber(name) === null) {
      setError('Введите имя русскими буквами — минимум две буквы.');
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      setError('Укажите корректный e-mail — на него придёт результат.');
      return;
    }

    setError('');
    setBusy(true);
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ name: name.trim(), email: email.trim() })
    );
    router.push('/result');
  };

  return (
    <>
      <main className="shell">
        <section className="hero">
          <span className="hero-mark">
            <Hash size={14} strokeWidth={2.2} />
            Нумерология имени
          </span>
          <h1>Какой денежный блок записан в твоём имени</h1>
          <p className="hero-sub">
            По русской таблице Пифагора имя сворачивается в одно число — и у каждого числа
            свой финансовый блок. Введите имя, чтобы увидеть свой.
          </p>
          <p className="hero-note">Расчёт занимает 10 секунд. Название блока — бесплатно.</p>
        </section>

        <section className="narrow" id="form">
          <form className="form-card" onSubmit={submit}>
            <div className="field">
              <label htmlFor="name">Ваше имя</label>
              <input
                id="name"
                type="text"
                placeholder="Даниил"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={40}
                required
              />
              <p className="field-hint">
                Только имя, русскими буквами. Так, как вас называют чаще всего.
              </p>
            </div>

            <div className="field">
              <label htmlFor="email">E-mail для результата</label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {error ? <p className="field-error">{error}</p> : null}

            <button className="btn-primary" type="submit" disabled={busy}>
              <KeyRound size={18} strokeWidth={2} />
              {busy ? 'Считаем число...' : 'Найти блок'}
            </button>

            <p className="consent">
              Нажимая кнопку, вы соглашаетесь с{' '}
              <Link href="/privacy">политикой конфиденциальности</Link> и{' '}
              <Link href="/offer">условиями оферты</Link>.
            </p>
          </form>
        </section>

        <div className="rule">
          <Hash size={17} strokeWidth={2} />
        </div>

        <section className="narrow">
          <h2 className="section-title">Как считается число имени</h2>
          <p className="section-lead">
            Каждой букве русского алфавита соответствует число от 1 до 9. Сумма всех букв
            сворачивается до одного разряда — кроме мастер-чисел 11 и 22.
          </p>

          <div style={{ marginTop: 26 }}>
            <div className="faq-item">
              <h3>Какое имя вводить?</h3>
              <p>
                То, которым вас называют в жизни. Если вас зовут Александр, но все зовут
                Саша — вводите Саша: работает то имя, которое звучит каждый день.
              </p>
            </div>
            <div className="faq-item">
              <h3>Что такое мастер-числа?</h3>
              <p>
                11 и 22 не сворачиваются до одной цифры. В нумерологии их считают числами
                повышенного потенциала — и блоки у них соответствующие: масштаб и
                предназначение.
              </p>
            </div>
            <div className="faq-item">
              <h3>Это работает?</h3>
              <p>
                Нумерология — не наука, и мы этого не скрываем. Практическая ценность
                разбора не в числе, а в описанных упражнениях: они работают независимо от
                того, верите вы в нумерологию или нет.
              </p>
            </div>
          </div>
        </section>

        <section className="narrow" style={{ marginTop: 48, textAlign: 'center' }}>
          <a className="btn-primary" href="#form" style={{ maxWidth: 380, margin: '0 auto' }}>
            Найти свой блок
            <ArrowRight size={18} strokeWidth={2} />
          </a>
        </section>
      </main>

      <footer className="site-foot shell">
        <p>
          <Link href="/blog">Блог</Link>
          <Link href="/privacy">Политика конфиденциальности</Link>
          <Link href="/offer">Публичная оферта</Link>
        </p>
        <p>
          Евдокимов Даниил Владимирович · ИНН 381928138362 · Самозанятый
          <br />
          danyavdkmvv3@gmail.com · @dvdkmv
        </p>
        <p className="disclaimer">
          {SITE.name} — развлекательный сервис. Материалы не являются финансовой или
          психологической консультацией.
        </p>
      </footer>
    </>
  );
}
