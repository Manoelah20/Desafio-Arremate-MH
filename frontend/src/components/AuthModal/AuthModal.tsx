import React, { useEffect, useState } from 'react';
import { authenticate, type AuthUser } from '../../api';
import './AuthModal.css';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthenticated: (user: AuthUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onAuthenticated }) => {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);
    try {
      const user = await authenticate(tab, { name, email, password });
      onAuthenticated(user);
      onClose();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível autenticar.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-modal__backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="auth-modal__content" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="auth-modal__close-btn"
          onClick={onClose}
          aria-label="Fechar"
        >
          ✕
        </button>

        {/* Cabeçalho do Modal */}
        <div className="auth-modal__header">
          <div className="auth-modal__logo-icon">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m14 12-8.5 8.5a2.12 2.12 0 1 1-3-3L11 9" />
              <path d="M15 13 9 7l4-4 6 6-4 4Z" />
              <path d="m21 15-4-4" />
            </svg>
          </div>
          <h3 className="auth-modal__title">
            {tab === 'login' ? 'Acesse sua conta de teste' : 'Crie uma conta de teste'}
          </h3>
          <p className="auth-modal__subtitle">
            Use somente dados fictícios e uma senha que não utilize em outros serviços.
          </p>
        </div>

        {/* Abas Alternadoras */}
        <div className="auth-modal__tabs">
          <button
            type="button"
            className={`auth-modal__tab ${tab === 'login' ? 'active' : ''}`}
            onClick={() => { setTab('login'); setErrorMessage(null); }}
          >
            Entrar
          </button>
          <button
            type="button"
            className={`auth-modal__tab ${tab === 'register' ? 'active' : ''}`}
            onClick={() => { setTab('register'); setErrorMessage(null); }}
          >
            Novo Cadastro
          </button>
        </div>

        {/* Formulário */}
        <form onSubmit={handleSubmit} className="auth-modal__form">
          {tab === 'register' && (
            <div className="auth-modal__field">
              <label htmlFor="auth-name" className="auth-modal__label">
                Nome Completo
              </label>
              <input
                id="auth-name"
                type="text"
                className="auth-modal__input"
                placeholder="Ex: João da Silva"
                value={name}
                maxLength={120}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="auth-modal__field">
            <label htmlFor="auth-email" className="auth-modal__label">
              E-mail
            </label>
            <input
              id="auth-email"
              type="email"
              className="auth-modal__input"
              placeholder="seu.email@exemplo.com"
              value={email}
              maxLength={255}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-modal__field">
            <div className="auth-modal__field-header">
              <label htmlFor="auth-password" className="auth-modal__label">
                Senha
              </label>
              {tab === 'login' && (
                <span className="auth-modal__link">Recuperação de senha indisponível neste protótipo</span>
              )}
            </div>
            <input
              id="auth-password"
              type="password"
              className="auth-modal__input"
              placeholder="••••••••"
              value={password}
              minLength={tab === 'register' ? 8 : undefined}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="auth-modal__disclaimer">
            <span className="auth-modal__disclaimer-icon">ℹ️</span>
            <span>
              A autenticação é demonstrativa. Use somente dados fictícios e uma senha exclusiva para este teste.
            </span>
          </div>

          {errorMessage && (
            <div className="auth-modal__alert" role="alert">
              ⚠ {errorMessage}
            </div>
          )}

          <button type="submit" className="auth-modal__submit-btn" disabled={isSubmitting}>
            {isSubmitting ? 'Aguarde...' : tab === 'login' ? 'Entrar na demonstração' : 'Criar conta de teste'}
          </button>
        </form>
      </div>
    </div>
  );
};
