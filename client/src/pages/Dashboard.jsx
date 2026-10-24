import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { errMsg } from '../api';
import { useAuth } from '../AuthContext';
import PageLoader from '../components/PageLoader';

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');
  const [q, setQ] = useState('');

  useEffect(() => {
    api.get('/students/stats').then((r) => setStats(r.data)).catch((e) => setError(errMsg(e)));
  }, []);

  const search = (e) => {
    e.preventDefault();
    navigate(`/students?search=${encodeURIComponent(q.trim())}`);
  };

  if (error) return <div className="alert">{error}</div>;
  if (!stats) return <PageLoader label="Loading dashboard…" />;

  const cards = [
    { label: 'Total students', value: stats.total },
    { label: 'Added this week', value: stats.thisWeek },
    { label: 'Courses', value: stats.courses },
    { label: 'Your role', value: user.role, text: true },
  ];

  return (
    <>
      <header className="page-head">
        <div>
          <h1>Hello, {user.name.split(' ')[0]}</h1>
          <p className="muted">Here is what is happening with your students.</p>
        </div>
        <Link to="/students/new" className="btn btn-primary">Add student</Link>
      </header>

      <form className="searchbar" onSubmit={search}>
        <input placeholder="Search by name, roll number, email or course" value={q} onChange={(e) => setQ(e.target.value)} />
        <button className="btn btn-primary">Search</button>
      </form>

      <section className="stats">
        {cards.map((c) => (
          <div className="stat" key={c.label}>
            <span className="muted">{c.label}</span>
            <strong className={c.text ? 'stat-text' : ''}>{c.value}</strong>
          </div>
        ))}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h2>Recent registrations</h2>
          <Link to="/students">View all</Link>
        </div>
        {stats.recent.length === 0 ? (
          <p className="empty">No students yet. <Link to="/students/new">Add the first one.</Link></p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Name</th><th>Roll no.</th><th>Course</th><th>Added</th></tr>
              </thead>
              <tbody>
                {stats.recent.map((s) => (
                  <tr key={s._id}>
                    <td data-label="Name"><Link to={`/students/${s._id}`}>{s.name}</Link></td>
                    <td data-label="Roll no.">{s.rollNo}</td>
                    <td data-label="Course">{s.course}</td>
                    <td data-label="Added">{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}