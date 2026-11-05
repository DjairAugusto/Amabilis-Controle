import {
    LayoutDashboard,
    Building2,
    Package,
    ClipboardPen,
    ChartBar,
    Truck,
    Drill,
    Map
} from 'lucide-react';

export const navItems = [
    { texto: 'Dashboard', link: '/', icon: LayoutDashboard },
    { texto: 'Obras', link: '/obras', icon: Building2 },  
    { texto: 'Estoque', link: '/estoque', icon: Package },
    { texto: 'Atividades', link: '/atividades', icon: ClipboardPen },
    { texto: 'Relatórios', link: '/relatorios', icon: ChartBar },
    { texto: 'Fornecedores', link: '/fornecedores', icon: Truck },  
    { texto: 'Recursos', link: '/recursos', icon: Drill },
    { texto: 'Mapa', link: '/mapa', icon: Map },
]