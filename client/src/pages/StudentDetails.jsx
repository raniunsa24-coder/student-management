import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';
import PageLoader from '../components/PageLoader';

export default function StudentDetails() {
  const { id } = useParams();
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [s, setS] = useState(null);
  const [error, setError] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    api.get(`/students/${id}`).then((r) => setS(r.data)).catch((e) => setError(errMsg(e)));
  }, [id]);

  const remove = async () => {
    if (!window.confirm(`Delete ${s.name}? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await api.delete(`/students/${id}`);
      navigate('/students');
    } catch (e) {
      setError(errMsg(e));
      setDeleting(false);
    }
  };

  if (error && !s) return <><div className="alert">{error}</div><Link to="/students">Back to students</Link></>;
  if (!s) return <PageLoader label="Loading student…" />;

  const rows = [
    ['Roll number', s.rollNo],
    ['Email', s.email],
    ['Phone', s.phone],
    ['Course', s.course],
    ['Gender', s.gender],
    ['Age', s.age ?? 'Not provided'],
    ['Address', s.address || 'Not provided'],
    ['Added by', s.createdBy?.name || 'Unknown'],
    ['Registered on', new Date(s.createdAt).toLocaleString()],
  ];

  return (
    <>
      <header className="page-head">
        <div>
          <h1>{s.name}</h1>
          <p className="muted">{s.course}</p>
        </div>
        <div className="actions">
          <Link to="/students" className="btn btn-ghost">Back</Link>
          {isAdmin && (
            <>
              <Link to={`/students/${id}/edit`} className="btn btn-primary">Edit</Link>
              <button className="btn btn-danger" onClick={remove} disabled={deleting}>{deleting ? 'Deleting…' : 'Delete'}</button>
            </>
          )}
        </div>
      </header>
      {error && <div className="alert">{error}</div>}
      <section className="panel">
        <dl className="details">
          {rows.map(([k, v]) => (
            <div key={k}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </dl>
      </section>
    </>
  );
}
