import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import '../styles/pages/login.css';

/**
 * LoginPage - Página de inicio de sesión
 * Usa useAuth para autenticación y useState para el formulario
 */
function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(''); // Limpiar error al escribir
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        // Validación básica
        if (!formData.email || !formData.password) {
            setError('Por favor completa todos los campos');
            setLoading(false);
            return;
        }

        // Intentar login
        const result = await login(formData.email, formData.password);

        if (result.success) {
            navigate('/'); // Redirigir a home
        } else {
            setError(result.error || 'Error al iniciar sesión');
        }

        setLoading(false);
    };

    return (
        <div className="login-page">
            <div className="login-page__container">
                <div className="login-page__card">
                    <div className="login-page__header">
                        <h1 className="login-page__title">Iniciar Sesión</h1>
                        <p className="login-page__subtitle">
                            Accede a tu cuenta para gestionar tus pedidos
                        </p>
                    </div>

                    <form className="login-page__form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="login-page__error">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="login-page__field">
                            <label className="login-page__label" htmlFor="email">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                className="login-page__input"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="tu@email.com"
                                autoComplete="email"
                            />
                        </div>

                        <div className="login-page__field">
                            <label className="login-page__label" htmlFor="password">
                                Contraseña
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                className="login-page__input"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                autoComplete="current-password"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                        </Button>
                    </form>

                    <div className="login-page__footer">
                        <p className="login-page__footer-text">
                            ¿No tienes cuenta?{' '}
                            <Link to="/register" className="login-page__link">
                                Regístrate aquí
                            </Link>
                        </p>
                    </div>

                    <div className="login-page__demo">
                        <p className="login-page__demo-title">👤 Usuarios de prueba:</p>
                        <ul className="login-page__demo-list">
                            <li>Aksell Emilio Cornejo Carmona / user1@demo.com / pass123</li>
                            <li>Giovanni Adair Avilés García / user2@demo.com / pass123</li>
                            <li>Yimy Enrique Huaman Quispe / user3@demo.com / pass123</li>
                            <li>Nicolas Reyes Meza / user4@demo.com / pass123</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;
