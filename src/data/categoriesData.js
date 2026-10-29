export const navCategories = [
  { 
    name: 'Prebuilt PCs', 
    href: '#prebuilts', 
    icon: '🖥️',
    isHot: false,
    items: [
      { name: 'Gaming Desktops', href: '#gaming-pcs' },
      { name: 'Workstations', href: '#workstations' },
      { name: 'Budget Builds', href: '#budget-pcs' },
      { name: 'Custom Liquid Cooled', href: '#custom-loop' }
    ]
  },
  { 
    name: 'PC Components', 
    href: '#components', 
    icon: '🧩',
    isHot: false,
    items: [
      { name: 'Graphics Cards (GPUs)', href: '#gpus' },
      { name: 'Processors (CPUs)', href: '#cpus' },
      { name: 'Motherboards', href: '#motherboards' },
      { name: 'RAM (Memory)', href: '#ram' },
      { name: 'Storage (SSD / HDD)', href: '#storage' },
      { name: 'Power Supplies (PSU)', href: '#psu' },
      { name: 'PC Cases', href: '#cases' }
    ]
  },
  { 
    name: 'Graphics Cards', 
    href: '#gpus', 
    icon: '🎮',
    isHot: false,
    items: [
      { name: 'NVIDIA RTX 40 Series', href: '#rtx-40' },
      { name: 'NVIDIA RTX 30 Series', href: '#rtx-30' },
      { name: 'AMD Radeon RX 7000', href: '#rx-7000' },
      { name: 'Intel Arc Series', href: '#intel-arc' }
    ]
  },
  { 
    name: 'Processors & Cooling', 
    href: '#cpus', 
    icon: '⚡',
    isHot: false,
    items: [
      { name: 'Intel Core i9 / i7 / i5', href: '#intel-cpus' },
      { name: 'AMD Ryzen 9 / 7 / 5', href: '#amd-cpus' },
      { name: 'AIO Liquid Coolers', href: '#aio-coolers' },
      { name: 'Air Coolers & Fans', href: '#air-coolers' }
    ]
  },
  { 
    name: 'Monitors & Gear', 
    href: '#monitors', 
    icon: '⌨️',
    isHot: false,
    items: [
      { name: '4K & 2K Gaming Monitors', href: '#monitors-gaming' },
      { name: 'Mechanical Keyboards', href: '#keyboards' },
      { name: 'Gaming Mice', href: '#mice' },
      { name: 'Headsets & Audio', href: '#audio' }
    ]
  },
  { 
    name: 'Deals & Sales', 
    href: '#deals', 
    icon: '🔥',
    isHot: true,
    items: [
      { name: 'Daily Flash Sales', href: '#flash-deals' },
      { name: 'Clearance Hardware', href: '#clearance' },
      { name: 'Bundles & Savings', href: '#bundles' }
    ]
  },
];