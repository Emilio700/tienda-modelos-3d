import './../../styles/components/button.css';

/**
 * Componente Button reutilizable con diferentes variantes
 * @param {Object} props
 * @param {string} props.variant - Variante del botón: 'primary', 'secondary', 'danger', 'outline'
 * @param {string} props.size - Tamaño: 'small', 'medium', 'large'
 * @param {boolean} props.fullWidth - Si el botón debe ocupar todo el ancho
 * @param {boolean} props.loading - Estado de carga
 * @param {boolean} props.disabled - Estado deshabilitado
 * @param {string} props.type - Tipo de botón HTML
 * @param {Function} props.onClick - Función manejadora de click
 * @param {React.ReactNode} props.children - Contenido del botón
 */
function Button({
    variant = 'primary',
    size = 'medium',
    fullWidth = false,
    loading = false,
    disabled = false,
    type = 'button',
    onClick,
    children,
    ...rest
}) {
    const classNames = [
        'button',
        `button--${variant}`,
        size !== 'medium' && `button--${size}`,
        fullWidth && 'button--full',
        loading && 'button--loading'
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classNames}
            onClick={onClick}
            disabled={disabled || loading}
            {...rest}
        >
            {loading && <span className="button__spinner"></span>}
            {children}
        </button>
    );
}

export default Button;
