import React from "react";
import PropTypes from "prop-types";

const Button = ({ label, onClick, className }) => {
  return (
    <div>
      <button
        onClick={onClick}
        class={`bg-yellow-700 hover:bg-green-600 text-gray-200 px-6 py-3 rounded-full group ${
          className || ""
        }`}
      >
        <div className="group-active:scale-95">{label}</div>
      </button>
    </div>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  className: PropTypes.string,
};

export default Button;
