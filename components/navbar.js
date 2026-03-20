import { Fragment } from 'react'
import Link from 'next/link';
import { useRouter } from 'next/router';

import { Popover, Transition } from '@headlessui/react'
import {
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

const navigation = [
  { name: 'GitHub', href: '/' },
  { name: 'GitLab', href: '/gitlab' },
  { name: 'Blog', href: '/blog' },
  { name: 'Pricing', href: '/pricing' },
  { name: 'Docs', href: 'https://docs.actuated.com/' },
]

function isActive(pathname, href) {
  if (href === '/') return pathname === '/'
  return pathname.startsWith(href)
}

export default function NavBar({ children }) {
  const router = useRouter()

  return (
    <header>
        <Popover className="relative bg-white">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-6 sm:px-6 md:justify-start md:space-x-10 lg:px-8">
            <div className="flex justify-start lg:w-0 lg:flex-1">
              <Link href="/">
                <span className="sr-only">Actuated</span>
                <img
                  className="h-8 w-auto sm:h-10"
                  src="/images/actuated.png"
                  alt="Actuated logo"
                />
              </Link>
            </div>
            <div className="-my-2 -mr-2 md:hidden">
              <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </Popover.Button>
            </div>
            <nav className="hidden space-x-10 md:flex">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={
                    isActive(router.pathname, item.href)
                      ? 'text-base font-medium text-indigo-600 border-b-2 border-indigo-600 pb-1'
                      : 'text-base font-medium text-gray-500 hover:text-gray-900'
                  }
                >
                  {item.name}
                </Link>
              ))}
            </nav>

          <div className="hidden items-center justify-end md:flex md:flex-1 lg:w-0">
            <a href="https://dashboard.actuated.com" className="whitespace-nowrap text-base font-medium text-gray-500 hover:text-gray-900">
              Sign in
            </a>
            <a
              href="/pricing"
              className="ml-8 inline-flex items-center justify-center whitespace-nowrap rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
            >
              Sign-up
            </a>
          </div>

          </div>

          <Transition
            as={Fragment}
            enter="duration-200 ease-out"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="duration-100 ease-in"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Popover.Panel
              focus
              className="absolute inset-x-0 top-0 z-30 origin-top-right transform p-2 transition md:hidden"
            >
              <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-5 pt-5 pb-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <img
                        className="h-8 w-auto"
                        src="/images/actuated.png"
                        alt="Actuated"
                      />
                    </div>
                    <div className="-mr-2">
                      <Popover.Button className="inline-flex items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                        <span className="sr-only">Close menu</span>
                        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                      </Popover.Button>
                    </div>
                  </div>
                </div>
                <div className="py-6 px-5">
                  <div className="grid grid-cols-2 gap-4">
                    {navigation.map((item) => (
                      <Popover.Button
                        as={Link}
                        key={item.name}
                        href={item.href}
                        className={
                          isActive(router.pathname, item.href)
                            ? 'text-base font-medium text-indigo-600'
                            : 'text-base font-medium text-gray-900 hover:text-gray-700'
                        }
                      >
                        {item.name}
                      </Popover.Button>
                    ))}
                  </div>
                  <div className="mt-6">
                    <Popover.Button
                      as={Link}
                      href="https://docs.google.com/forms/d/e/1FAIpQLScA12IGyVFrZtSAp2Oj24OdaSMloqARSwoxx3AZbQbs0wpGww/viewform"
                      className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-indigo-700"
                    >
                      Sign-up
                    </Popover.Button>
                  </div>
                  <div className="mt-6">
                    <Popover.Button
                      as={Link}
                      href="https://dashboard.actuated.com"
                      className="flex w-full items-center justify-center rounded-md border border-solid	 bg-white px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-900 shadow-sm"
                    >
                      Sign in
                    </Popover.Button>
                  </div>

                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
      </header>
  )
}
