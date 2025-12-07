import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useLocalStorage from '../hooks/useLocalStorage';
import useAuth from '../hooks/useAuth';
import Button from '../components/common/Button';

/**
 * OrdersPage - Historial de pedidos con autenticación
 * Usa useLocalStorage y useAuth para obtener pedidos del backend
 * Usa useEffect para cargar pedidos y scroll
 */
function OrdersPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [localOrders] = useLocalStorage('3d-models-orders', []);
    const [returns, setReturns] = useLocalStorage('3d-models-returns', []);
    const [showModal, setShowModal] = useState(false);
    const [selectedOrderForReturn, setSelectedOrderForReturn] = useState(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showClearModal, setShowClearModal] = useState(false);
    const { getUserOrders } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        const result = await getUserOrders();

        if (result.success) {
            // Combinar pedidos del backend con localStorage
            const allOrders = [...result.orders, ...localOrders];
            // Eliminar duplicados basados en id
            const uniqueOrders = allOrders.filter((order, index, self) =>
                index === self.findIndex((t) => t.id === order.id)
            );
            // Filtrar pedidos que ya tienen solicitud de devolución
            const returnedOrderIds = returns.map(r => r.orderId);
            const filteredOrders = uniqueOrders.filter(order => !returnedOrderIds.includes(order.id));
            setOrders(filteredOrders);
        } else {
            // Si falla el backend, usar solo localStorage
            const returnedOrderIds = returns.map(r => r.orderId);
            const filteredOrders = localOrders.filter(order => !returnedOrderIds.includes(order.id));
            setOrders(filteredOrders);
        }
        setLoading(false);
    };

    const handleReturnRequest = (order) => {
        setSelectedOrderForReturn(order);
        setShowModal(true);
    };

    const confirmReturn = () => {
        if (selectedOrderForReturn) {
            const returnRequest = {
                id: `RET-${Date.now()}`,
                orderId: selectedOrderForReturn.id,
                orderDate: selectedOrderForReturn.date,
                items: selectedOrderForReturn.items,
                total: selectedOrderForReturn.total,
                status: 'pending',
                requestDate: new Date().toISOString(),
                reason: 'Solicitud directa desde pedidos'
            };

            // Guardar solicitud de devolución
            setReturns([...returns, returnRequest]);

            // Eliminar pedido de la lista de órdenes
            const updatedOrders = orders.filter(order => order.id !== selectedOrderForReturn.id);
            setOrders(updatedOrders);

            setShowModal(false);
            setSelectedOrderForReturn(null);

            // Mostrar modal de éxito
            setShowSuccessModal(true);
            setTimeout(() => {
                setShowSuccessModal(false);
            }, 3000);
        }
    };

    const cancelReturn = () => {
        setShowModal(false);
        setSelectedOrderForReturn(null);
    };

    const clearAllOrders = () => {
        setShowClearModal(true);
    };

    const confirmClearOrders = () => {
        setOrders([]);
        localStorage.removeItem('3d-models-orders');
        setShowClearModal(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'processing': return 'var(--color-warning)';
            case 'shipped': return 'var(--color-info)';
            case 'delivered': return 'var(--color-success)';
            case 'return-requested': return 'var(--color-accent)';
            case 'returned': return 'var(--color-text-muted)';
            default: return 'var(--color-text-secondary)';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'processing': return '⏳ Procesando';
            case 'shipped': return '🚚 Enviado';
            case 'delivered': return '✅ Entregado';
            case 'return-requested': return '↩️ Devolución Solicitada';
            case 'returned': return '🔄 Devuelto';
            default: return status;
        }
    };

    return (
        <div className="container" style={{ padding: 'var(--spacing-8) 0' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--spacing-6)'
            }}>
                <h1>Mis Pedidos</h1>
                {orders.length > 0 && (
                    <Button
                        variant="outline"
                        size="small"
                        onClick={clearAllOrders}
                        style={{ color: 'var(--color-error)' }}
                    >
                        🗑️ Limpiar Todo (Demo)
                    </Button>
                )}
            </div>

            {location.state?.newOrder && (
                <div style={{
                    padding: 'var(--spacing-4)',
                    background: 'var(--color-success)',
                    color: 'white',
                    borderRadius: 'var(--radius-lg)',
                    marginBottom: 'var(--spacing-6)',
                    textAlign: 'center'
                }}>
                    ✅ ¡Pedido realizado con éxito! Recibirás un email de confirmación.
                </div>
            )}

            {loading ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>⏳</div>
                    <h2>Cargando pedidos...</h2>
                </div>
            ) : orders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem 0' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📦</div>
                    <h2>No tienes pedidos</h2>
                    <p style={{ color: 'var(--color-text-secondary)', marginBottom: '2rem' }}>
                        Comienza a comprar modelos 3D increíbles
                    </p>
                    <Button variant="primary" onClick={() => navigate('/store')}>
                        Explorar Productos
                    </Button>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-4)' }}>
                    {orders.map((order) => (
                        <div
                            key={order.id}
                            style={{
                                background: 'var(--color-surface)',
                                borderRadius: 'var(--radius-xl)',
                                padding: 'var(--spacing-6)',
                                border: '1px solid var(--color-border)'
                            }}
                        >
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'start',
                                marginBottom: 'var(--spacing-4)',
                                paddingBottom: 'var(--spacing-4)',
                                borderBottom: '1px solid var(--color-border)'
                            }}>
                                <div>
                                    <h3 style={{ marginBottom: 'var(--spacing-2)' }}>Pedido #{order.id}</h3>
                                    <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-sm)' }}>
                                        {new Date(order.date).toLocaleDateString('es-ES', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <span style={{
                                    padding: 'var(--spacing-2) var(--spacing-4)',
                                    background: `${getStatusColor(order.status)}20`,
                                    color: getStatusColor(order.status),
                                    borderRadius: 'var(--radius-full)',
                                    fontSize: 'var(--font-size-sm)',
                                    fontWeight: 'var(--font-weight-semibold)'
                                }}>
                                    {getStatusText(order.status)}
                                </span>
                            </div>

                            <div style={{ marginBottom: 'var(--spacing-4)' }}>
                                <h4 style={{ fontSize: 'var(--font-size-sm)', marginBottom: 'var(--spacing-3)', color: 'var(--color-text-secondary)' }}>
                                    Productos ({order.items.length})
                                </h4>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--spacing-2)' }}>
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 'var(--spacing-3)',
                                                padding: 'var(--spacing-2)',
                                                background: 'var(--color-bg-tertiary)',
                                                borderRadius: 'var(--radius-md)'
                                            }}
                                        >
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
                                                <p style={{ fontWeight: 'var(--font-weight-semibold)', fontSize: 'var(--font-size-sm)' }}>
                                                    {item.name}
                                                </p>
                                                <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--font-size-xs)' }}>
                                                    Cantidad: {item.quantity}
                                                </p>
                                            </div>
                                            <span style={{ fontWeight: 'var(--font-weight-semibold)' }}>
                                                ${(item.price * item.quantity).toFixed(2)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                paddingTop: 'var(--spacing-4)',
                                borderTop: '1px solid var(--color-border)'
                            }}>
                                <div>
                                    <span style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-text-secondary)' }}>
                                        Total:
                                    </span>
                                    <span style={{
                                        marginLeft: 'var(--spacing-2)',
                                        fontSize: 'var(--font-size-xl)',
                                        fontWeight: 'var(--font-weight-bold)',
                                        color: 'var(--color-primary-light)'
                                    }}>
                                        ${order.total.toFixed(2)}
                                    </span>
                                </div>

                                <Button
                                    variant="secondary"
                                    size="small"
                                    onClick={() => handleReturnRequest(order)}
                                >
                                    📦 Solicitar Devolución
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal de confirmación */}
            {showModal && (
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
                            ⚠️
                        </div>
                        <h2 style={{
                            textAlign: 'center',
                            marginBottom: 'var(--spacing-4)'
                        }}>
                            ¿Confirmar Solicitud de Devolución?
                        </h2>
                        <p style={{
                            textAlign: 'center',
                            color: 'var(--color-text-secondary)',
                            marginBottom: 'var(--spacing-6)'
                        }}>
                            Se creará una solicitud de devolución para el pedido <strong>#{selectedOrderForReturn?.id}</strong>.
                            Podrás ver el estado en la sección de "Devoluciones".
                        </p>
                        <div style={{
                            display: 'flex',
                            gap: 'var(--spacing-3)',
                            justifyContent: 'center'
                        }}>
                            <Button
                                variant="outline"
                                onClick={cancelReturn}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="primary"
                                onClick={confirmReturn}
                            >
                                Confirmar Devolución
                            </Button>
                        </div>
                    </div>
                </div>
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
                            ¿Limpiar todos los pedidos?
                        </h2>
                        <p style={{
                            textAlign: 'center',
                            color: 'var(--color-text-secondary)',
                            marginBottom: 'var(--spacing-6)'
                        }}>
                            Esta acción eliminará <strong>todos tus pedidos</strong> de la demo y no se puede deshacer.
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
                                onClick={confirmClearOrders}
                                style={{ background: 'var(--color-error)' }}
                            >
                                Sí, Eliminar Todo
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de éxito para devolución */}
            {showSuccessModal && (
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
                    zIndex: 2000,
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
                            ¡Devolución iniciada!
                        </h2>
                        <p style={{
                            color: 'var(--color-text-secondary)',
                            marginBottom: 'var(--spacing-2)'
                        }}>
                            El pedido se movió a la sección Devoluciones
                        </p>
                        <p style={{
                            fontSize: 'var(--font-size-sm)',
                            color: 'var(--color-text-muted)'
                        }}>
                            Puedes ver el estado en la sección de Devoluciones
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default OrdersPage;
