'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Calculator,
  DollarSign,
  TrendingUp,
  Users,
  Clock,
  Shield,
  Zap,
  Download,
  FileText,
  BarChart3,
  Calendar,
  CheckCircle2,
  Package,
  Building2,
  Rocket,
  Target,
  PieChart,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function DealRoom() {
  const [activeTab, setActiveTab] = useState('roi-calculator');

  // ROI Calculator State
  const [employees, setEmployees] = useState(100);
  const [avgSalary, setAvgSalary] = useState(75000);
  const [currentLicense, setCurrentLicense] = useState('none');
  const [targetSolution, setTargetSolution] = useState('m365-e3');
  const [industryType, setIndustryType] = useState('general');

  // ROI Metrics
  const calculateROI = () => {
    // Base productivity gains by solution
    const productivityGains = {
      'm365-e3': 0.15, // 15% productivity increase
      'm365-e5': 0.22, // 22% productivity increase
      'dynamics-sales': 0.25, // 25% sales efficiency
      'dynamics-service': 0.20, // 20% service efficiency
      'power-platform': 0.18, // 18% automation gains
      'azure-migration': 0.30, // 30% cost reduction
    };

    // License costs per user per year
    const licenseCosts = {
      'm365-e3': 432, // $36/month
      'm365-e5': 684, // $57/month
      'dynamics-sales': 780, // $65/month
      'dynamics-service': 588, // $49/month
      'power-platform': 240, // $20/month
      'azure-migration': 1200, // estimated migration cost per user
    };

    const productivityGain = productivityGains[targetSolution] || 0.15;
    const annualSalaryCost = employees * avgSalary;
    const productivityValue = annualSalaryCost * productivityGain;

    const totalLicenseCost = employees * (licenseCosts[targetSolution] || 432);
    const netBenefit = productivityValue - totalLicenseCost;
    const roi = ((netBenefit / totalLicenseCost) * 100).toFixed(1);
    const paybackMonths = Math.ceil((totalLicenseCost / (productivityValue / 12)));

    return {
      productivityValue: Math.round(productivityValue),
      totalLicenseCost: Math.round(totalLicenseCost),
      netBenefit: Math.round(netBenefit),
      roi,
      paybackMonths,
      yearlyRecurring: Math.round(productivityValue - totalLicenseCost),
    };
  };

  const roiMetrics = calculateROI();

  // Solutions catalog
  const solutions = [
    {
      id: 'm365-e3',
      name: 'Microsoft 365 E3',
      category: 'Productivity',
      price: '$36/user/month',
      benefits: ['Office Apps', 'Teams', 'SharePoint', 'Exchange', 'Security'],
      icon: Package,
      color: 'blue'
    },
    {
      id: 'm365-e5',
      name: 'Microsoft 365 E5',
      category: 'Productivity',
      price: '$57/user/month',
      benefits: ['E3 + Advanced Security', 'Phone System', 'Power BI', 'Advanced Compliance'],
      icon: Shield,
      color: 'purple'
    },
    {
      id: 'dynamics-sales',
      name: 'Dynamics 365 Sales',
      category: 'CRM',
      price: '$65/user/month',
      benefits: ['Sales Automation', 'Lead Management', 'AI Insights', 'Mobile App'],
      icon: Target,
      color: 'pink'
    },
    {
      id: 'dynamics-service',
      name: 'Dynamics 365 Customer Service',
      category: 'Service',
      price: '$49/user/month',
      benefits: ['Case Management', 'Knowledge Base', 'Omnichannel', 'AI Chatbots'],
      icon: Users,
      color: 'green'
    },
    {
      id: 'power-platform',
      name: 'Power Platform',
      category: 'Low-Code',
      price: '$20/user/month',
      benefits: ['Power Apps', 'Power Automate', 'Power BI', 'Custom Solutions'],
      icon: Zap,
      color: 'violet'
    },
    {
      id: 'azure-migration',
      name: 'Azure Cloud Migration',
      category: 'Infrastructure',
      price: 'Custom',
      benefits: ['Cost Reduction', 'Scalability', 'Security', 'Global Reach'],
      icon: Building2,
      color: 'cyan'
    }
  ];

  // Resources
  const resources = [
    { name: 'Microsoft 365 E3 Datasheet', type: 'PDF', size: '2.4 MB', icon: FileText },
    { name: 'Dynamics 365 Sales Demo', type: 'Video', size: '45 min', icon: FileText },
    { name: 'Azure Cost Calculator', type: 'Excel', size: '1.2 MB', icon: FileText },
    { name: 'Security & Compliance Guide', type: 'PDF', size: '5.8 MB', icon: FileText },
    { name: 'Power Platform Case Studies', type: 'PDF', size: '3.1 MB', icon: FileText },
    { name: 'Implementation Roadmap', type: 'PDF', size: '1.8 MB', icon: FileText },
  ];

  // Implementation timeline
  const timeline = [
    { phase: 'Discovery & Planning', duration: '2 weeks', tasks: ['Requirements gathering', 'Architecture design', 'Resource planning'] },
    { phase: 'Pilot Deployment', duration: '3 weeks', tasks: ['Test environment setup', 'Pilot user training', 'Feedback collection'] },
    { phase: 'Full Rollout', duration: '6 weeks', tasks: ['Phased deployment', 'User training', 'Change management'] },
    { phase: 'Optimization', duration: '4 weeks', tasks: ['Performance tuning', 'User adoption', 'Best practices'] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl shadow-lg">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Deal Room
              </h1>
              <p className="text-gray-600 text-lg">Close deals faster with data-driven insights</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-6 bg-white p-2 rounded-xl shadow-md flex-wrap">
          {[
            { id: 'roi-calculator', label: 'ROI Calculator', icon: Calculator },
            { id: 'solutions', label: 'Solutions', icon: Package },
            { id: 'pricing', label: 'Pricing', icon: DollarSign },
            { id: 'resources', label: 'Resources', icon: FileText },
            { id: 'timeline', label: 'Timeline', icon: Calendar },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ROI Calculator Tab */}
        {activeTab === 'roi-calculator' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Input Card */}
            <Card className="shadow-xl border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calculator className="w-6 h-6 text-blue-600" />
                  ROI Calculator
                </CardTitle>
                <CardDescription>Calculate your return on investment</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6 pt-6">
                {/* Number of Employees */}
                <div>
                  <Label htmlFor="employees" className="text-base font-semibold">Number of Employees</Label>
                  <Input
                    id="employees"
                    type="number"
                    value={employees}
                    onChange={(e) => setEmployees(Number(e.target.value))}
                    className="mt-2 text-lg"
                  />
                </div>

                {/* Average Salary */}
                <div>
                  <Label htmlFor="salary" className="text-base font-semibold">Average Annual Salary (USD)</Label>
                  <Input
                    id="salary"
                    type="number"
                    value={avgSalary}
                    onChange={(e) => setAvgSalary(Number(e.target.value))}
                    className="mt-2 text-lg"
                  />
                </div>

                {/* Target Solution */}
                <div>
                  <Label htmlFor="solution" className="text-base font-semibold">Target Solution</Label>
                  <select
                    id="solution"
                    value={targetSolution}
                    onChange={(e) => setTargetSolution(e.target.value)}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {solutions.map((sol) => (
                      <option key={sol.id} value={sol.id}>
                        {sol.name} - {sol.price}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Industry Type */}
                <div>
                  <Label htmlFor="industry" className="text-base font-semibold">Industry Type</Label>
                  <select
                    id="industry"
                    value={industryType}
                    onChange={(e) => setIndustryType(e.target.value)}
                    className="w-full mt-2 p-3 border border-gray-300 rounded-lg text-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="general">General Business</option>
                    <option value="manufacturing">Manufacturing</option>
                    <option value="retail">Retail</option>
                    <option value="healthcare">Healthcare</option>
                    <option value="finance">Financial Services</option>
                    <option value="education">Education</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <div className="space-y-4">
              {/* Summary Card */}
              <Card className="shadow-xl border-2 border-green-100 bg-gradient-to-br from-green-50 to-emerald-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-2xl text-green-700">
                    <TrendingUp className="w-6 h-6" />
                    ROI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-1">Return on Investment</div>
                    <div className="text-4xl font-bold text-green-600">{roiMetrics.roi}%</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-1">Payback Period</div>
                    <div className="text-3xl font-bold text-blue-600">{roiMetrics.paybackMonths} months</div>
                  </div>

                  <div className="bg-white p-4 rounded-lg shadow">
                    <div className="text-sm text-gray-600 mb-1">Annual Net Benefit</div>
                    <div className="text-3xl font-bold text-purple-600">
                      ${roiMetrics.netBenefit.toLocaleString()}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Breakdown */}
              <Card className="shadow-xl border-2 border-purple-100">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-purple-600" />
                    Financial Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 pt-4">
                  <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                    <span className="text-gray-700 font-medium">Productivity Value</span>
                    <span className="text-green-600 font-bold text-lg">
                      +${roiMetrics.productivityValue.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                    <span className="text-gray-700 font-medium">License Investment</span>
                    <span className="text-red-600 font-bold text-lg">
                      -${roiMetrics.totalLicenseCost.toLocaleString()}
                    </span>
                  </div>

                  <div className="h-px bg-gray-300" />

                  <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                    <span className="text-gray-700 font-bold">First Year Net</span>
                    <span className="text-blue-600 font-bold text-xl">
                      ${roiMetrics.netBenefit.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-gray-700 font-bold">3-Year Value</span>
                    <span className="text-purple-600 font-bold text-xl">
                      ${(roiMetrics.yearlyRecurring * 3).toLocaleString()}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                  <Download className="w-4 h-4 mr-2" />
                  Download Report
                </Button>
                <Button variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50">
                  <FileText className="w-4 h-4 mr-2" />
                  Generate Proposal
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Solutions Tab */}
        {activeTab === 'solutions' && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {solutions.map((solution) => {
              const Icon = solution.icon;
              const colorClasses = {
                blue: 'from-blue-500 to-blue-600 border-blue-200',
                purple: 'from-purple-500 to-purple-600 border-purple-200',
                pink: 'from-pink-500 to-pink-600 border-pink-200',
                green: 'from-green-500 to-green-600 border-green-200',
                violet: 'from-violet-500 to-violet-600 border-violet-200',
                cyan: 'from-cyan-500 to-cyan-600 border-cyan-200',
              };

              return (
                <Card key={solution.id} className={`shadow-xl border-2 ${colorClasses[solution.color]} hover:shadow-2xl transition-all`}>
                  <CardHeader>
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${colorClasses[solution.color]} flex items-center justify-center mb-3 shadow-lg`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <CardTitle className="text-xl">{solution.name}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-medium">{solution.category}</span>
                      <span className="text-lg font-bold text-gray-900">{solution.price}</span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="font-semibold text-sm text-gray-700 mb-3">Key Benefits:</div>
                      {solution.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{benefit}</span>
                        </div>
                      ))}
                    </div>
                    <Button
                      onClick={() => {
                        setTargetSolution(solution.id);
                        setActiveTab('roi-calculator');
                      }}
                      className="w-full mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Calculate ROI
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Pricing Tab */}
        {activeTab === 'pricing' && (
          <div className="space-y-6">
            <Card className="shadow-xl border-2 border-blue-100">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <DollarSign className="w-6 h-6 text-blue-600" />
                  Pricing Estimator
                </CardTitle>
                <CardDescription>Get a customized quote for your organization</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b-2 border-gray-200">
                        <th className="text-left p-4 font-bold">Solution</th>
                        <th className="text-left p-4 font-bold">Per User/Month</th>
                        <th className="text-left p-4 font-bold">Annual (100 users)</th>
                        <th className="text-left p-4 font-bold">Annual (500 users)</th>
                        <th className="text-center p-4 font-bold">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {solutions.map((solution, idx) => (
                        <tr key={solution.id} className={`border-b ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'} hover:bg-blue-50 transition-colors`}>
                          <td className="p-4 font-medium">{solution.name}</td>
                          <td className="p-4 text-gray-700">{solution.price}</td>
                          <td className="p-4 text-green-600 font-bold">
                            {solution.price !== 'Custom'
                              ? `$${(parseInt(solution.price.replace(/[^0-9]/g, '')) * 12 * 100).toLocaleString()}`
                              : 'Contact us'}
                          </td>
                          <td className="p-4 text-green-600 font-bold">
                            {solution.price !== 'Custom'
                              ? `$${(parseInt(solution.price.replace(/[^0-9]/g, '')) * 12 * 500).toLocaleString()}`
                              : 'Contact us'}
                          </td>
                          <td className="p-4 text-center">
                            <Button size="sm" variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-50">
                              <Sparkles className="w-3 h-3 mr-1" />
                              Quote
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-yellow-600 mt-0.5" />
                    <div>
                      <div className="font-bold text-yellow-900 mb-1">Volume Discounts Available</div>
                      <div className="text-sm text-yellow-800">
                        Organizations with 500+ users may qualify for volume licensing discounts. Contact our team for a custom quote.
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Resources Tab */}
        {activeTab === 'resources' && (
          <div className="space-y-6">
            <Card className="shadow-xl border-2 border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <FileText className="w-6 h-6 text-purple-600" />
                  Resource Library
                </CardTitle>
                <CardDescription>Download materials to support your evaluation</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-4">
                  {resources.map((resource, idx) => {
                    const Icon = resource.icon;
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 p-4 bg-white border-2 border-gray-200 rounded-lg hover:border-purple-400 hover:shadow-lg transition-all cursor-pointer group"
                      >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">
                            {resource.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span>{resource.type}</span>
                            <span>•</span>
                            <span>{resource.size}</span>
                          </div>
                        </div>
                        <Download className="w-5 h-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Timeline Tab */}
        {activeTab === 'timeline' && (
          <div className="space-y-6">
            <Card className="shadow-xl border-2 border-green-100">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2 text-2xl">
                  <Calendar className="w-6 h-6 text-green-600" />
                  Implementation Timeline
                </CardTitle>
                <CardDescription>Typical deployment timeline for Microsoft solutions</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  {timeline.map((phase, idx) => (
                    <div key={idx} className="relative pl-8 pb-6 border-l-4 border-blue-300 last:border-l-0 last:pb-0">
                      <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white text-xs font-bold shadow-lg">
                        {idx + 1}
                      </div>
                      <div className="bg-white p-5 rounded-lg shadow-md border-2 border-gray-100 hover:border-blue-200 transition-all">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-xl font-bold text-gray-900">{phase.phase}</h3>
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {phase.duration}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {phase.tasks.map((task, taskIdx) => (
                            <div key={taskIdx} className="flex items-center gap-2 text-gray-700">
                              <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                              <span>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-5 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border-2 border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <Rocket className="w-6 h-6 text-blue-600" />
                    <div className="font-bold text-lg text-gray-900">Total Timeline: 15 weeks</div>
                  </div>
                  <p className="text-gray-700">
                    Timeline may vary based on organization size, complexity, and current infrastructure. Our team will work with you to create a customized implementation plan.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
