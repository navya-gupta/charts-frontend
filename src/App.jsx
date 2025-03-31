import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import ErrorComponent from './components/shared/ErrorComponent';
import Layout from './components/shared/SideBar/SidebarLayout';
import Home from './pages/Home';
import MasterCurveGraph from './pages/MasterCurveGraph';
import Menu from './pages/Menu';
import ModulusVsStrainRateGraph from './pages/ModulusVsStrainRateGraph';
import ModulusVsStrainRateTemperature3D from './pages/ModulusVsStrainRateTemperature3D';
import ModulusVsTemperatureGraph from './pages/ModulusVsTemperatureGraph';
import RelaxationModulusWithTime from './pages/RelaxationModulusWithTime';
import SheerModulusVsFrequencyGraph from './pages/SheerModulusVsFrequencyGraph';
import Upload from './pages/Upload';

const App = () => {
  const SIDEBAR_ROUTES = [
    '/menu',
    '/relaxation-modulus-with-time',
    '/master-curve-graph',
    '/modulus-vs-strain-rate',
    '/sheer-modulus-vs-frequency',
    '/modulus-vs-temperature',
    '/modulus-strainrate-temperature-3d'
  ];

  return (
    <Router>
      <Layout sidebarRoutes={SIDEBAR_ROUTES}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/menu" element={<Menu />} />
          <Route path='/relaxation-modulus-with-time' element={<RelaxationModulusWithTime />} />
          <Route path='/master-curve-graph' element={<MasterCurveGraph />} />
          <Route path='/modulus-vs-strain-rate' element={<ModulusVsStrainRateGraph />} />
          <Route path='modulus-vs-temperature' element={<ModulusVsTemperatureGraph />} />
          <Route path='/modulus-strainrate-temperature-3d' element={<ModulusVsStrainRateTemperature3D />} />
          <Route path="/sheer-modulus-vs-frequency" element={<SheerModulusVsFrequencyGraph />} />

          {/* <Route path="*" element={<Navigate to="/" />} /> */}
          <Route path="*" element={<ErrorComponent errorCode='404' showErrorCode={true} showErrorIcon={true} showHeader={true} errorMessage='The page you requested was not found!' codeColor='#ffc107' subMessage='You may return to home page by clicking' />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;