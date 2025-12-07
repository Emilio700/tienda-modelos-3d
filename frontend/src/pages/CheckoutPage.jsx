import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import useAuth from '../hooks/useAuth';
import useLocalStorage from '../hooks/useLocalStorage';
import Button from '../components/common/Button';

/**
 * CheckoutPage - Página de checkout con autenticación
 * useState para el formulario, useCart para procesar el pedido, y useAuth para vincular con usuario
 */
function CheckoutPage() {
    const navigate = useNavigate();
    const { cart, getTotal, clearCart } = useCart();
    const { createOrder, getCurrentUser } = useAuth();
    const [orders, setOrders] = useLocalStorage('3d-models-orders', []);
    const user = getCurrentUser();

    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: '',
        address: '',
        city: '',
        zipCode: '',
        paymentMethod: 'credit-card'
    });

    const [errors, setErrors] = useState({});
    const [isProcessing, setIsProcessing] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    if (cart.length === 0) {
        navigate('/cart');
        return null;
    }

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Limpiar error del campo
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Nombre requerido';
        if (!formData.email.trim()) newErrors.email = 'Email requerido';
        if (!formData.phone.trim()) newErrors.phone = 'Teléfono requerido';
        if (!formData.address.trim()) newErrors.address = 'Dirección requerida';
        if (!formData.city.trim()) newErrors.city = 'Ciudad requerida';
        if (!formData.zipCode.trim()) newErrors.zipCode = 'Código postal requerido';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        // Mostrar modal de procesando
        setIsProcessing(true);

        // Simular procesamiento de pago (2 segundos)
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Crear orden
        const orderData = {
            items: [...cart],
            total: getTotal(),
            shippingInfo: { ...formData },
            status: 'processing'
        };

        // Guardar orden en el backend
        const result = await createOrder(orderData);

        if (result.success) {
            // También guardar en localStorage como copia local
            const newOrder = result.order;
            setOrders([newOrder, ...orders]);

            // Limpiar carrito
            clearCart();

            // Ocultar procesando y mostrar éxito
            setIsProcessing(false);
            setShowSuccess(true);

            // Redirigir después de 3 segundos
            setTimeout(() => {
                navigate('/orders', { state: { newOrder: true } });
            }, 3000);
        } else {
            setIsProcessing(false);
            alert('Error al crear el pedido: ' + result.error);
        }
    };

    return (
        <div className="container" style={{ padding: 'var(--spacing-8) 0', maxWidth: '800px' }}>
            <h1 style={{ marginBottom: 'var(--spacing-8)' }}>Finalizar Compra</h1>

            <form onSubmit={handleSubmit}>
                {/* Información de contacto */}
                <div style={{
                    background: 'var(--color-surface)',
                    padding: 'var(--spacing-6)',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: 'var(--spacing-6)'
                }}>
                    <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Información de Contacto</h2>

                    <div style={{ marginBottom: 'var(--spacing-4)' }}>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                            Nombre Completo *
                        </label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: 'var(--spacing-3)',
                                background: 'var(--color-bg-tertiary)',
                                border: errors.name ? '2px solid var(--color-error)' : '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text)',
                                fontSize: 'var(--font-size-base)'
                            }}
                        />
                        {errors.name && <span style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)' }}>{errors.name}</span>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                                Email *
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: 'var(--spacing-3)',
                                    background: 'var(--color-bg-tertiary)',
                                    border: errors.email ? '2px solid var(--color-error)' : '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-text)',
                                    fontSize: 'var(--font-size-base)'
                                }}
                            />
                            {errors.email && <span style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)' }}>{errors.email}</span>}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                                Teléfono *
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: 'var(--spacing-3)',
                                    background: 'var(--color-bg-tertiary)',
                                    border: errors.phone ? '2px solid var(--color-error)' : '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-text)',
                                    fontSize: 'var(--font-size-base)'
                                }}
                            />
                            {errors.phone && <span style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)' }}>{errors.phone}</span>}
                        </div>
                    </div>
                </div>

                {/* Dirección de envío */}
                <div style={{
                    background: 'var(--color-surface)',
                    padding: 'var(--spacing-6)',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: 'var(--spacing-6)'
                }}>
                    <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Dirección de Envío</h2>

                    <div style={{ marginBottom: 'var(--spacing-4)' }}>
                        <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                            Dirección *
                        </label>
                        <input
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            style={{
                                width: '100%',
                                padding: 'var(--spacing-3)',
                                background: 'var(--color-bg-tertiary)',
                                border: errors.address ? '2px solid var(--color-error)' : '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text)',
                                fontSize: 'var(--font-size-base)'
                            }}
                        />
                        {errors.address && <span style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)' }}>{errors.address}</span>}
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-4)' }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                                Ciudad *
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: 'var(--spacing-3)',
                                    background: 'var(--color-bg-tertiary)',
                                    border: errors.city ? '2px solid var(--color-error)' : '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-text)',
                                    fontSize: 'var(--font-size-base)'
                                }}
                            />
                            {errors.city && <span style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)' }}>{errors.city}</span>}
                        </div>

                        <div>
                            <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                                Código Postal *
                            </label>
                            <input
                                type="text"
                                name="zipCode"
                                value={formData.zipCode}
                                onChange={handleChange}
                                style={{
                                    width: '100%',
                                    padding: 'var(--spacing-3)',
                                    background: 'var(--color-bg-tertiary)',
                                    border: errors.zipCode ? '2px solid var(--color-error)' : '1px solid var(--color-border)',
                                    borderRadius: 'var(--radius-md)',
                                    color: 'var(--color-text)',
                                    fontSize: 'var(--font-size-base)'
                                }}
                            />
                            {errors.zipCode && <span style={{ color: 'var(--color-error)', fontSize: 'var(--font-size-sm)' }}>{errors.zipCode}</span>}
                        </div>
                    </div>
                </div>

                {/* Método de pago */}
                <div style={{
                    background: 'var(--color-surface)',
                    padding: 'var(--spacing-6)',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: 'var(--spacing-6)'
                }}>
                    <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Método de Pago</h2>

                    <select
                        name="paymentMethod"
                        value={formData.paymentMethod}
                        onChange={handleChange}
                        style={{
                            width: '100%',
                            padding: 'var(--spacing-3)',
                            background: 'var(--color-bg-tertiary)',
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            color: 'var(--color-text)',
                            fontSize: 'var(--font-size-base)',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="credit-card">Tarjeta de Crédito</option>
                        <option value="debit-card">Tarjeta de Débito</option>
                        <option value="paypal">PayPal</option>
                        <option value="transfer">Transferencia Bancaria</option>
                    </select>
                </div>

                {/* Total y submit */}
                <div style={{
                    background: 'var(--color-surface)',
                    padding: 'var(--spacing-6)',
                    borderRadius: 'var(--radius-xl)',
                    marginBottom: 'var(--spacing-6)'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: 'var(--font-size-2xl)',
                        fontWeight: 'var(--font-weight-bold)',
                        marginBottom: 'var(--spacing-6)'
                    }}>
                        <span>Total:</span>
                        <span style={{ color: 'var(--color-primary-light)' }}>${getTotal().toFixed(2)}</span>
                    </div>

                    <Button type="submit" variant="primary" size="large" fullWidth>
                        Confirmar Pedido
                    </Button>
                </div>
            </form>

            {/* Modal de procesando pago */}
            {isProcessing && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'var(--color-surface)',
                        borderRadius: 'var(--radius-2xl)',
                        padding: 'var(--spacing-10)',
                        textAlign: 'center',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                        border: '1px solid var(--color-border)'
                    }}>
                        <div className="spinner" style={{
                            margin: '0 auto var(--spacing-6)',
                            width: '60px',
                            height: '60px',
                            borderWidth: '6px'
                        }}></div>
                        <h2 style={{ marginBottom: 'var(--spacing-2)' }}>Procesando Pago...</h2>
                        <p style={{ color: 'var(--color-text-secondary)' }}>
                            Por favor espera mientras procesamos tu orden
                        </p>
                    </div>
                </div>
            )}

            {/* Modal de compra exitosa */}
            {showSuccess && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'var(--color-surface)',
                        borderRadius: 'var(--radius-2xl)',
                        padding: 'var(--spacing-10)',
                        textAlign: 'center',
                        maxWidth: '500px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                        border: '1px solid var(--color-border)'
                    }}>
                        <div style={{
                            fontSize: '5rem',
                            marginBottom: 'var(--spacing-4)',
                            animation: 'fadeIn 0.5s ease-out'
                        }}>
                            ✅
                        </div>
                        <h2 style={{
                            marginBottom: 'var(--spacing-3)',
                            color: 'var(--color-success)'
                        }}>
                            ¡Compra Exitosa!
                        </h2>
                        <p style={{
                            color: 'var(--color-text-secondary)',
                            marginBottom: 'var(--spacing-2)'
                        }}>
                            Tu pedido ha sido procesado correctamente
                        </p>
                        <p style={{
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-muted)'
                        }}>
                            Redirigiendo a tus pedidos...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CheckoutPage;
