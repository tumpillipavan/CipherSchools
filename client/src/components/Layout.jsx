import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiDatabase } from 'react-icons/fi';
import '../styles/main.scss';

const Layout = ({ children }) => {
    const location = useLocation();

    return (
        <div className="app-layout">
            <nav style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                padding: '1rem 0',
                background: 'rgba(11, 15, 25, 0.8)',
                backdropFilter: 'blur(10px)',
                position: 'sticky',
                top: 0,
                zIndex: 100
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white'
                        }}>
                            <FiDatabase size={18} />
                        </div>
                        <h1 style={{
                            margin: 0,
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            background: 'linear-gradient(to right, #fff, #94a3b8)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent'
                        }}>
                            CipherSQLStudio
                        </h1>
                    </Link>
                </div>
            </nav>

            <main className={location.pathname.startsWith('/assignment/') ? 'container-fluid' : 'container'} style={{ marginTop: '2rem', minHeight: 'calc(100vh - 80px)' }}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
