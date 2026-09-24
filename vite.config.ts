import react from '@vitejs/plugin-react'
import { defineConfig, type Plugin } from 'vite'
import fs from 'fs'
import path from 'path'

function studentDbPlugin(): Plugin {
  const dbFile = path.resolve(process.cwd(), 'students_db.json')

  const getStudents = () => {
    try {
      if (!fs.existsSync(dbFile)) {
        fs.writeFileSync(dbFile, JSON.stringify([], null, 2))
      }
      return JSON.parse(fs.readFileSync(dbFile, 'utf-8'))
    } catch {
      return []
    }
  }

  const saveStudents = (data: any[]) => {
    try {
      fs.writeFileSync(dbFile, JSON.stringify(data, null, 2))
    } catch (e) {
      console.error('Failed to save students:', e)
    }
  }

  return {
    name: 'student-db-api',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const url = req.url?.split('?')[0]
        if (url === '/api/students' && req.method === 'GET') {
          res.setHeader('Content-Type', 'application/json')
          res.setHeader('Access-Control-Allow-Origin', '*')
          res.end(JSON.stringify(getStudents()))
          return
        }

        if (url === '/api/students' && req.method === 'POST') {
          let body = ''
          req.on('data', chunk => { body += chunk })
          req.on('end', () => {
            try {
              const newEntry = JSON.parse(body)
              const existing = getStudents()
              const map = new Map<string, any>()
              existing.forEach((s: any) => {
                if (s.email) map.set(s.email.toLowerCase(), s)
                else if (s.uid) map.set(s.uid, s)
              })
              if (Array.isArray(newEntry)) {
                newEntry.forEach(s => {
                  if (s.email) map.set(s.email.toLowerCase(), { ...map.get(s.email.toLowerCase()), ...s })
                  else if (s.uid) map.set(s.uid, { ...map.get(s.uid), ...s })
                })
              } else if (newEntry?.email) {
                map.set(newEntry.email.toLowerCase(), { ...map.get(newEntry.email.toLowerCase()), ...newEntry })
              } else if (newEntry?.uid) {
                map.set(newEntry.uid, { ...map.get(newEntry.uid), ...newEntry })
              }
              const updated = Array.from(map.values())
              saveStudents(updated)
              res.setHeader('Content-Type', 'application/json')
              res.setHeader('Access-Control-Allow-Origin', '*')
              res.end(JSON.stringify({ success: true, count: updated.length, students: updated }))
            } catch (err: any) {
              res.statusCode = 400
              res.end(JSON.stringify({ error: err.message }))
            }
          })
          return
        }

        next()
      })
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), studentDbPlugin()],
})

