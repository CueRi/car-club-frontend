import PropTypes from "prop-types";

const Alert = ({ variant = "default", className, children, ...props }) => {
  const variantClasses = {
    default: "bg-gray-100 text-gray-900",
    destructive: "bg-red-100 text-red-900",
  };

  return (
    <div
      role="alert"
      className={`rounded-lg p-4 ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

const AlertDescription = ({ className, children, ...props }) => {
  return (
    <div className={`text-sm ${className}`} {...props}>
      {children}
    </div>
  );
};

Alert.propTypes = {
  variant: PropTypes.oneOf(["default", "destructive"]),
  className: PropTypes.string,
  children: PropTypes.node,
};

AlertDescription.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
};

export { Alert, AlertDescription };
