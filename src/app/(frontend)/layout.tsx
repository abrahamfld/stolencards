import React from 'react'
import './styles.css'


// components
import { Topbar } from './components/Topbar'
import { Footer } from './components/Footer'


// export const metadata = {
//   description: 'A blank template using Payload in a Next.js app.',
//   title: 'Payload Blank Template',
// }

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body className="">
        <Topbar/>
        <main>{children}</main>
        <Footer/>
      </body>
    </html>
  )
}
