"use client"

import type React from "react"
import styles from './page.module.css'
import { useState } from "react"
import { ArrowUpDown, Calendar, Check, Clock, User, X } from "lucide-react"

// Custom components
const Card = ({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) => (
  <div className="bg-white rounded-lg shadow-md p-4">
    <div className="flex justify-between items-center mb-2">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      {icon}
    </div>
    {children}
  </div>
)

const Button = ({
  children,
  onClick,
  className = "",
}: { children: React.ReactNode; onClick?: () => void; className?: string }) => (
  <button className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${className}`} onClick={onClick}>
    {children}
  </button>
)

const Select = ({
  value,
  onChange,
  options,
}: { value: string; onChange: (value: string) => void; options: { value: string; label: string }[] }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
        <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
      </svg>
    </div>
  </div>
)

const Table = ({ headers, children }: { headers: React.ReactNode[]; children: React.ReactNode }) => (
  <div className="overflow-x-auto">
    <table className="min-w-full bg-white">
      <thead className="bg-gray-100">
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200">{children}</tbody>
    </table>
  </div>
)

// Mock data
const userData = {
  id: "1",
  name: "John Doe",
  email: "john.doe@example.com",
  class: "10A",
}

const attendanceData = [
  { date: "2023-05-01", period1: true, period2: true, period3: false, period4: true },
  { date: "2023-05-02", period1: true, period2: false, period3: true, period4: true },
  { date: "2023-05-03", period1: false, period2: true, period3: true, period4: true },
  { date: "2023-05-04", period1: true, period2: true, period3: true, period4: false },
  { date: "2023-05-05", period1: true, period2: true, period3: true, period4: true },
]

export default function StudentDashboard({ params }: { params: { userId: string } }) {
  const [sortColumn, setSortColumn] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [viewType, setViewType] = useState<"day" | "period">("day")

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  const sortedData = [...attendanceData].sort((a, b) => {
    if (!sortColumn) return 0
    if (a[sortColumn as keyof typeof a] < b[sortColumn as keyof typeof b]) {
      return sortDirection === "asc" ? -1 : 1
    }
    if (a[sortColumn as keyof typeof a] > b[sortColumn as keyof typeof b]) {
      return sortDirection === "asc" ? 1 : -1
    }
    return 0
  })

  const calculateAttendancePercentage = () => {
    const totalClasses = attendanceData.length * 4
    const attendedClasses = attendanceData.reduce((total, day) => {
      return total + Object.values(day).filter(Boolean).length - 1 // Subtract 1 to exclude the date
    }, 0)
    return ((attendedClasses / totalClasses) * 100).toFixed(2)
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 pt-24 {styles.dashboard} ">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Student Dashboard</h1>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card title="Student Name" icon={<User className="h-5 w-5 text-blue-500" />}>
            <div className="text-2xl font-bold text-gray-800">{userData.name}</div>
            <p className="text-sm text-gray-500">{userData.email}</p>
          </Card>
          <Card title="Class" icon={<Calendar className="h-5 w-5 text-green-500" />}>
            <div className="text-2xl font-bold text-gray-800">{userData.class}</div>
          </Card>
          <Card title="Attendance Percentage" icon={<Clock className="h-5 w-5 text-purple-500" />}>
            <div className="text-2xl font-bold text-gray-800">{calculateAttendancePercentage()}%</div>
          </Card>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Attendance Record</h2>
            <Select
              value={viewType}
              onChange={(value) => setViewType(value as "day" | "period")}
              options={[
                { value: "day", label: "Day-wise View" },
                { value: "period", label: "Period-wise View" },
              ]}
            />
          </div>
          <Table
            headers={[
              <Button key="date" onClick={() => handleSort("date")} className="text-gray-500 hover:text-gray-700">
                Date <ArrowUpDown className="inline-block ml-1 h-4 w-4" />
              </Button>,
              ...(viewType === "day" ? ["Attendance"] : ["Period 1", "Period 2", "Period 3", "Period 4"]),
            ]}
          >
            {sortedData.map((day) => (
              <tr key={day.date} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{day.date}</td>
                {viewType === "day" ? (
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {
                      Object.entries(day)
                        .filter(([key]) => key !== "date")
                        .filter(([, value]) => value).length
                    }{" "}
                    / 4
                  </td>
                ) : (
                  <>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.period1 ? <Check className="text-green-500" /> : <X className="text-red-500" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.period2 ? <Check className="text-green-500" /> : <X className="text-red-500" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.period3 ? <Check className="text-green-500" /> : <X className="text-red-500" />}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {day.period4 ? <Check className="text-green-500" /> : <X className="text-red-500" />}
                    </td>
                  </>
                )}
              </tr>
            ))}
          </Table>
        </div>
      </div>
    </div>
  )
}

