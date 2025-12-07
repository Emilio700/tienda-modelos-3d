import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import Button from '../components/common/Button';

/**
 * ReturnsPage - Solicitud de devoluciones
 * Usa useState para el formulario de devolución
 * Usa useLocalStorage para órdenes
 */
function ReturnsPage() {
    const [orders, setOrders] = useLocalStorage('3d-models-orders', []);
    const [returns] = useLocalStorage('3d-models-returns', []);
    const location = useLocation();
    const navigate = useNavigate();

    const [selectedOrder, setSelectedOrder] = useState(location.state?.orderId || '');
    const [selectedItems, setSelectedItems] = useState([]);
    const [reason, setReason] = useState('');
    const [comments, setComments] = useState('');
    const [success, setSuccess] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const eligibleOrders = orders.filter(order =>
        order.status === 'delivered' && order.status !== 'return-requested'
    );

    const handleItemToggle = (itemId) => {
        setSelectedItems(prev =>
            prev.includes(itemId)
                ? prev.filter(id => id !== itemId)
                : [...prev, itemId]
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!selectedOrder || selectedItems.length === 0 || !reason) {
            alert('Por favor completa todos los campos requeridos');
            return;
        }

        // Actualizar estado de la orden
        setOrders(orders.map(order =>
            order.id === selectedOrder
                ? { ...order, status: 'return-requested' }
                : order
        ));

        setSuccess(true);

        // Reset form
        setTimeout(() => {
            navigate('/orders');
        }, 2000);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'var(--color-warning)';
            case 'approved': return 'var(--color-success)';
            case 'rejected': return 'var(--color-error)';
            default: return 'var(--color-text-secondary)';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'pending': return '⏳ Pendiente';
            case 'approved': return '✅ Aprobada';
            case 'rejected': return '❌ Rechazada';
            default: return status;
        }
    };

    const clearAllReturns = () => {
        setShowClearModal(true);
    };

    const confirmClearReturns = () => {
        localStorage.removeItem('3d-models-returns');
        window.location.reload();
    };

    if (success) {
        return (
            <div className="container" style={{ textAlign: 'center', padding: '4rem 0' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>✅</div>
                <h2>Solicitud de Devolución Enviada</h2>
                <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                    Procesaremos tu solicitud en 24-48 horas
                </p>
            </div>
        );
    }

    return (
        <div className="container" style={{ padding: 'var(--spacing-8) 0', maxWidth: '900px' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-8)'
            }}>
                <h1>📦 Devoluciones</h1>
                {returns.length > 0 && (
                    <Button
                        variant="outline"
                        size="small"
                        onClick={clearAllReturns}
                        style={{ color: 'var(--color-error)' }}
                    >
                        🗑️ Limpiar Todo (Demo)
                    </Button>
                )}
            </div>

            {/* Solicitudes existentes */}
            {returns.length > 0 && (
                <div style={{ marginBottom: 'var(--spacing-8)' }}>
                    <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Mis Solicitudes de Devolución</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                        {returns.map(returnRequest => (
                            <div
                                key={returnRequest.id}
                                style={{
                                    background: 'var(--color-surface)',
                                    padding: 'var(--spacing-6)',
                                    borderRadius: 'var(--radius-xl)',
                                    border: '1px solid var(--color-border)'
                                }}
                            >
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'start',
                                    marginBottom: 'var(--spacing-4)'
                                }}>
                                    <div>
                                        <h3 style={{ marginBottom: 'var(--spacing-2)' }}>
                                            Devolución #{returnRequest.id}
                                        </h3>
                                        <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--font-size-sm)' }}>
                                            Pedido original: #{returnRequest.orderId}
                                        </p>
                                        <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                                            Solicitado: {new Date(returnRequest.requestDate).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <span style={{
                                        padding: 'var(--spacing-2) var(--spacing-4)',
                                        background: getStatusColor(returnRequest.status) + '20',
                                        color: getStatusColor(returnRequest.status),
                                        borderRadius: 'var(--radius-full)',
                                        fontSize: 'var(--font-size-sm)',
                                        fontWeight: 'var(--font-weight-semibold)'
                                    }}>
                                        {getStatusText(returnRequest.status)}
                                    </span>
                                </div>

                                <div style={{
                                    borderTop: '1px solid var(--color-border)',
                                    paddingTop: 'var(--spacing-4)',
                                    marginTop: 'var(--spacing-4)'
                                }}>
                                    <p style={{ fontWeight: 'var(--font-weight-semibold)', marginBottom: 'var(--spacing-2)' }}>
                                        Artículos ({returnRequest.items.length}):
                                    </p>
                                    {returnRequest.items.map(item => (
                                        <div key={item.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-3)',
                                            padding: 'var(--spacing-2) 0'
                                        }}>
                                            <img
                                                src={item.images[0]}
                                                alt={item.name}
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    objectFit: 'cover',
                                                    borderRadius: 'var(--radius-sm)'
                                                }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <p style={{ fontSize: 'var(--font-size-sm)' }}>{item.name}</p>
                                                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-muted)' }}>
                                                    Cantidad: {item.quantity}
                                                </p>
                                            </div>
                                            <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                    <div style={{
                                        borderTop: '1px solid var(--color-border)',
                                        paddingTop: 'var(--spacing-3)',
                                        marginTop: 'var(--spacing-3)',
                                        textAlign: 'right'
                                    }}>
                                        <span style={{ fontWeight: 'var(--font-weight-bold)', fontSize: 'var(--font-size-lg)' }}>
                                            Total: ${returnRequest.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Formulario para nueva solicitud */}
            <h2 style={{ marginBottom: 'var(--spacing-6)' }}>Nueva Solicitud de Devolución</h2>

            {eligibleOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                    <h2>No hay pedidos elegibles para devolución</h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                        Solo puedes solicitar devoluciones de pedidos entregados
                    </p>
                    <Button variant="primary" onClick={() => navigate('/orders')}>
                        Ver Mis Pedidos
                    </Button>
                </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {/* Seleccionar pedido */}
                    <div style={{
                        background: 'var(--color-surface)',
                        padding: 'var(--spacing-6)',
                        borderRadius: 'var(--radius-xl)',
                        marginBottom: 'var(--spacing-6)'
                    }}>
                        <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Selecciona el Pedido</h2>
                        <select
                            value={selectedOrder}
                            onChange={(e) => {
                                setSelectedOrder(e.target.value);
                                setSelectedItems([]);
                            }}
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
                            required
                        >
                            <option value="">Selecciona un pedido...</option>
                            {eligibleOrders.map(order => (
                                <option key={order.id} value={order.id}>
                                    Pedido #{order.id} - {new Date(order.date).toLocaleDateString()} - ${order.total.toFixed(2)}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Seleccionar artículos */}
                    {selectedOrder && (
                        <div style={{
                            background: 'var(--color-surface)',
                            padding: 'var(--spacing-6)',
                            borderRadius: 'var(--radius-xl)',
                            marginBottom: 'var(--spacing-6)'
                        }}>
                            <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Selecciona los Artículos</h2>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-3)' }}>
                                {orders.find(o => o.id === selectedOrder)?.items.map(item => (
                                    <label
                                        key={item.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 'var(--spacing-3)',
                                            padding: 'var(--spacing-3)',
                                            background: selectedItems.includes(item.id) ? 'var(--color-primary)20' : 'var(--color-bg-tertiary)',
                                            border: selectedItems.includes(item.id) ? '2px solid var(--color-primary)' : '1px solid var(--color-border)',
                                            borderRadius: 'var(--radius-md)',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedItems.includes(item.id)}
                                            onChange={() => handleItemToggle(item.id)}
                                            style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                        />
                                        <img
                                            src={item.images[0]}
                                            alt={item.name}
                                            style={{
                                                width: '50px',
                                                height: '50px',
                                                objectFit: 'cover',
                                                borderRadius: 'var(--radius-sm)'
                                            }}
                                        />
                                        <div style={{ flex: 1 }}>
                                            <p style={{ fontWeight: 'var(--font-weight-semibold)' }}>{item.name}</p>
                                            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                                                Cantidad: {item.quantity} | ${(item.price * item.quantity).toFixed(2)}
                                            </p>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Motivo */}
                    <div style={{
                        background: 'var(--color-surface)',
                        padding: 'var(--spacing-6)',
                        borderRadius: 'var(--radius-xl)',
                        marginBottom: 'var(--spacing-6)'
                    }}>
                        <h2 style={{ marginBottom: 'var(--spacing-4)' }}>Motivo de la Devolución</h2>
                        <select
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            style={{
                                width: '100%',
                                padding: 'var(--spacing-3)',
                                background: 'var(--color-bg-tertiary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text)',
                                fontSize: 'var(--font-size-base)',
                                cursor: 'pointer',
                                marginBottom: 'var(--spacing-4)'
                            }}
                            required
                        >
                            <option value="">Selecciona un motivo...</option>
                            <option value="defective">Archivo defectuoso</option>
                            <option value="wrong-item">Modelo incorrecto</option>
                            <option value="not-as-described">No coincide con la descripción</option>
                            <option value="changed-mind">Cambié de opinión</option>
                            <option value="other">Otro</option>
                        </select>

                        <label style={{ display: 'block', marginBottom: 'var(--spacing-2)', fontSize: 'var(--font-size-sm)', fontWeight: 'var(--font-weight-semibold)' }}>
                            Comentarios Adicionales (opcional)
                        </label>
                        <textarea
                            value={comments}
                            onChange={(e) => setComments(e.target.value)}
                            rows={4}
                            placeholder="Describe el problema o motivo con más detalle..."
                            style={{
                                width: '100%',
                                padding: 'var(--spacing-3)',
                                background: 'var(--color-bg-tertiary)',
                                border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-md)',
                                color: 'var(--color-text)',
                                fontSize: 'var(--font-size-base)',
                                fontFamily: 'inherit',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <Button type="submit" variant="primary" size="large" fullWidth>
                        Enviar Solicitud de Devolución
                    </Button>
                </form>
            )}

            {/* Modal de confirmación para limpiar */}
            {showClearModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.7)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    backdropFilter: 'blur(4px)'
                }}>
                    <div style={{
                        background: 'var(--color-surface)',
                        borderRadius: 'var(--radius-2xl)',
                        padding: 'var(--spacing-8)',
                        maxWidth: '500px',
                        width: '90%',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.5)',
                        border: '1px solid var(--color-border)'
                    }}>
                        <div style={{
                            fontSize: '3rem',
                            textAlign: 'center',
                            marginBottom: 'var(--spacing-4)'
                        }}>
                            🗑️
                        </div>
                        <h2 style={{
                            textAlign: 'center',
                            marginBottom: 'var(--spacing-4)'
                        }}>
                            ¿Limpiar todas las devoluciones?
                        </h2>
                        <p style={{
                            textAlign: 'center',
                            color: 'var(--color-text-secondary)',
                            marginBottom: 'var(--spacing-6)'
                        }}>
                            Esta acción eliminará <strong>todas las solicitudes de devolución</strong> y recargará la página.
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: 'var(--spacing-3)',
                            justifyContent: 'center'
                        }}>
                            <Button
                                variant="outline"
                                onClick={() => setShowClearModal(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={confirmClearReturns}
                                style={{ background: 'var(--color-error)' }}
                            >
                                Sí, Eliminar Todo
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ReturnsPage;
