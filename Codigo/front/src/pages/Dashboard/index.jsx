import DashboardResumo from '../../resources/dashboard/components/DashboardResumo';
import EvolucaoMensalChart from '../../resources/dashboard/components/EvolucaoMensalChart';
import FornecedoresNfsCharts from '../../resources/dashboard/components/FornecedoresNFsCharts';
import CustoRecursosChart from '../../resources/dashboard/components/CustoRecursosChart';
import { DashboardProvider } from '../../resources/dashboard/context/DashboardContext';
import './Dashboard.css'

const DashboardContent = () => {
    return (
        <section className='dashboard-section'>
            <DashboardResumo />
            <div className='container-graficos'>
                <EvolucaoMensalChart />
                <FornecedoresNfsCharts />
                <CustoRecursosChart />
            </div>
        </section>
    )
}

const Dashboard = () => {
    return (
        <DashboardProvider>
            <DashboardContent />
        </DashboardProvider>
    )
}

export default Dashboard;