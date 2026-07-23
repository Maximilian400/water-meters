import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { meterStore } from './store/metersStore';
import MetersTable from './components/MetersTable';

const App = observer(() => {
  useEffect(() => {
    meterStore.loadMeters();
  }, []);

  return (
    <div className="app">
      <header className="header"></header>

      <section className="intro">
        <h1 className="intro__title">📱 Frontend Developer</h1>

        <p className="intro__subtitle">Тестовое задание</p>
      </section>

      <main className="main">
        {meterStore.error ? (
          <div>{meterStore.error}</div>
        ) : meterStore.loading && meterStore.meters.length === 0 ? (
          <p>Загрузка...</p>
        ) : (
          <MetersTable />
        )}
      </main>
    </div>
  );
});

export default App;
