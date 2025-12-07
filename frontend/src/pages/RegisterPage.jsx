import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';
import '../styles/pages/login.css';

/**
 * RegisterPage - Página de registro de usuarios
 * Usa useAuth para crear cuenta y useState para el formulario
 */
function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
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

        // Validación
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Por favor completa todos los campos');
            setLoading(false);
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden');
            setLoading(false);
            return;
        }

        if (formData.password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            setLoading(false);
            return;
        }

        // Intentar registro
        const result = await register(formData.name, formData.email, formData.password);

        if (result.success) {
            navigate('/'); // Redirigir a home después del registro exitoso
        } else {
            setError(result.error || 'Error al registrar usuario');
        }

        setLoading(false);
    };

    return (
        <div className="login-page">
            <div className="login-page__container">
                <div className="login-page__card">
                    <div className="login-page__header">
                        <h1 className="login-page__title">Crear Cuenta</h1>
                        <p className="login-page__subtitle">
                            Regístrate para comenzar a comprar modelos 3D
                        </p>
                    </div>

                    <form className="login-page__form" onSubmit={handleSubmit}>
                        {error && (
                            <div className="login-page__error">
                                ⚠️ {error}
                            </div>
                        )}

                        <div className="login-page__field">
                            <label className="login-page__label" htmlFor="name">
                                Nombre Completo
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="login-page__input"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Juan Pérez"
                                autoComplete="name"
                            />
                        </div>

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
                                autoComplete="new-password"
                            />
                        </div>

                        <div className="login-page__field">
                            <label className="login-page__label" htmlFor="confirmPassword">
                                Confirmar Contraseña
                            </label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="login-page__input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="••••••••"
                                autoComplete="new-password"
                            />
                        </div>

                        <Button
                            type="submit"
                            variant="primary"
                            size="large"
                            fullWidth
                            disabled={loading}
                        >
                            {loading ? 'Creando cuenta...' : 'Registrarse'}
                        </Button>
                    </form>

                    <div className="login-page__footer">
                        <p className="login-page__footer-text">
                            ¿Ya tienes cuenta?{' '}
                            <Link to="/login" className="login-page__link">
                                Inicia sesión aquí
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;
