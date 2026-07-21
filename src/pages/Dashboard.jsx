import { useAuth } from '../context/AuthContext'
import './Dashboard.css'

export default function Dashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="dashboard-shell">
      <header className="dashboard-header">
        <span className="auth-wordmark-dark">Spaza<em>Connect</em></span>
        <button className="btn-logout" onClick={logout}>Log out</button>
      </header>

      <main className="dashboard-body">
        <p className="dashboard-eyebrow">Signed in as</p>
        <h1>{user?.shopName || user?.username}</h1>
        <dl className="dashboard-details">
          <div>
            <dt>Username</dt>
            <dd>{user?.username}</dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>{user?.email}</dd>
          </div>
          <div>
            <dt>Cluster</dt>
            <dd>{user?.clusterLocation}</dd>
          </div>
        </dl>
        <p className="dashboard-note">
          This is a placeholder — products and buying pools land here next.
        </p>
      </main>
    </div>
  )
}
