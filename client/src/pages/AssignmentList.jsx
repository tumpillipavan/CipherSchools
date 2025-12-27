import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiCode, FiArrowRight } from 'react-icons/fi';
import Loader from '../components/Loader';
import '../styles/AssignmentList.scss';

const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50 } }
};

const AssignmentList = () => {
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/assignments');
                setAssignments(res.data);
                setLoading(false);
            } catch (err) {
                console.error(err);
                setError('Failed to fetch assignments. Is the server running?');
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);


    if (loading) return <Loader text="Loading Assignments..." />;

    if (error) return (
        <div style={{ textAlign: 'center', padding: '4rem', color: '#f43f5e' }}>
            <h2>Connection Error</h2>
            <p>{error}</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="assignment-list"
        >
            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                <motion.h1
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        marginBottom: '1rem',
                        background: 'linear-gradient(135deg, #fff 0%, #94a3b8 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent'
                    }}
                >
                    Master SQL by Doing
                </motion.h1>
                <motion.p
                    initial={{ y: -10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    style={{ color: '#94a3b8', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}
                >
                    Select a challenge below to start your journey into database mastery.
                </motion.p>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid"
            >
                {assignments.map(a => (
                    <Link to={`/assignment/${a._id}`} key={a._id} className="card">
                        <div className="card-header">
                            <span className={`badge ${a.difficulty.toLowerCase()}`}>
                                {a.difficulty}
                            </span>
                        </div>
                        <h3>{a.title}</h3>
                        <p>{a.description}</p>
                        <div style={{ marginTop: 'auto', paddingTop: '1rem', display: 'flex', alignItems: 'center', color: '#6366f1', fontWeight: '500', fontSize: '0.9rem' }}>
                            Start Challenge <FiArrowRight style={{ marginLeft: '0.5rem' }} />
                        </div>
                    </Link>
                ))}
            </motion.div>
        </motion.div>
    );
};

export default AssignmentList;
