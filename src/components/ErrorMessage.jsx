import React from 'react';
import { Link } from 'react-router-dom';

function ErrorMessage({ message, actionText = "Volver", actionLink = "/" }) {
    return (
        <div className="container my-5">
            <div className="alert alert-danger text-center">
                {message}
                <div className="mt-3">
                    <Link to={actionLink} className="btn btn-primary">
                        {actionText}
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default ErrorMessage;