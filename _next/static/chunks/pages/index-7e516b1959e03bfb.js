(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[405],{5557:function(e,t,s){(window.__NEXT_P=window.__NEXT_P||[]).push(["/",function(){return s(9796)}])},9796:function(e,t,s){"use strict";s.r(t),s.d(t,{default:function(){return U}});var a,l,i=s(5893),n=s(1664),r=s.n(n),o=s(7294),d=s(2984),c=s(2351),m=s(3784),u=s(9946),h=s(1363),x=s(4103),g=s(6567),p=s(4157),f=s(5466),b=s(3781),y=((a=y||{})[a.Open=0]="Open",a[a.Closed=1]="Closed",a),w=((l=w||{})[l.ToggleDisclosure=0]="ToggleDisclosure",l[l.CloseDisclosure=1]="CloseDisclosure",l[l.SetButtonId=2]="SetButtonId",l[l.SetPanelId=3]="SetPanelId",l[l.LinkPanel=4]="LinkPanel",l[l.UnlinkPanel=5]="UnlinkPanel",l);let j={0:e=>({...e,disclosureState:(0,d.E)(e.disclosureState,{0:1,1:0})}),1:e=>1===e.disclosureState?e:{...e,disclosureState:1},4:e=>!0===e.linkedPanel?e:{...e,linkedPanel:!0},5:e=>!1===e.linkedPanel?e:{...e,linkedPanel:!1},2:(e,t)=>e.buttonId===t.buttonId?e:{...e,buttonId:t.buttonId},3:(e,t)=>e.panelId===t.panelId?e:{...e,panelId:t.panelId}},v=(0,o.createContext)(null);function N(e){let t=(0,o.useContext)(v);if(null===t){let s=Error(`<${e} /> is missing a parent <Disclosure /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(s,N),s}return t}v.displayName="DisclosureContext";let k=(0,o.createContext)(null);k.displayName="DisclosureAPIContext";let I=(0,o.createContext)(null);function M(e,t){return(0,d.E)(t.type,j,e,t)}I.displayName="DisclosurePanelContext";let C=o.Fragment,S=(0,c.yV)(function(e,t){let{defaultOpen:s=!1,...a}=e,l=(0,o.useRef)(null),i=(0,m.T)(t,(0,m.h)(e=>{l.current=e},void 0===e.as||e.as===o.Fragment)),n=(0,o.useRef)(null),r=(0,o.useRef)(null),u=(0,o.useReducer)(M,{disclosureState:s?0:1,linkedPanel:!1,buttonRef:r,panelRef:n,buttonId:null,panelId:null}),[{disclosureState:h,buttonId:x},p]=u,y=(0,b.z)(e=>{p({type:1});let t=(0,f.r)(l);if(!t||!x)return;let s=e?e instanceof HTMLElement?e:e.current instanceof HTMLElement?e.current:t.getElementById(x):t.getElementById(x);null==s||s.focus()}),w=(0,o.useMemo)(()=>({close:y}),[y]),j=(0,o.useMemo)(()=>({open:0===h,close:y}),[h,y]);return o.createElement(v.Provider,{value:u},o.createElement(k.Provider,{value:w},o.createElement(g.up,{value:(0,d.E)(h,{0:g.ZM.Open,1:g.ZM.Closed})},(0,c.sY)({ourProps:{ref:i},theirProps:a,slot:j,defaultTag:C,name:"Disclosure"}))))}),A=(0,c.yV)(function(e,t){let s=(0,u.M)(),{id:a=`headlessui-disclosure-button-${s}`,...l}=e,[i,n]=N("Disclosure.Button"),r=(0,o.useContext)(I),d=null!==r&&r===i.panelId,g=(0,o.useRef)(null),f=(0,m.T)(g,t,d?null:i.buttonRef);(0,o.useEffect)(()=>{if(!d)return n({type:2,buttonId:a}),()=>{n({type:2,buttonId:null})}},[a,n,d]);let y=(0,b.z)(e=>{var t;if(d){if(1===i.disclosureState)return;switch(e.key){case h.R.Space:case h.R.Enter:e.preventDefault(),e.stopPropagation(),n({type:0}),null==(t=i.buttonRef.current)||t.focus()}}else switch(e.key){case h.R.Space:case h.R.Enter:e.preventDefault(),e.stopPropagation(),n({type:0})}}),w=(0,b.z)(e=>{e.key===h.R.Space&&e.preventDefault()}),j=(0,b.z)(t=>{var s;(0,x.P)(t.currentTarget)||e.disabled||(d?(n({type:0}),null==(s=i.buttonRef.current)||s.focus()):n({type:0}))}),v=(0,o.useMemo)(()=>({open:0===i.disclosureState}),[i]),k=(0,p.f)(e,g),M=d?{ref:f,type:k,onKeyDown:y,onClick:j}:{ref:f,id:a,type:k,"aria-expanded":e.disabled?void 0:0===i.disclosureState,"aria-controls":i.linkedPanel?i.panelId:void 0,onKeyDown:y,onKeyUp:w,onClick:j};return(0,c.sY)({ourProps:M,theirProps:l,slot:v,defaultTag:"button",name:"Disclosure.Button"})}),R=c.AN.RenderStrategy|c.AN.Static,E=Object.assign(S,{Button:A,Panel:(0,c.yV)(function(e,t){let s=(0,u.M)(),{id:a=`headlessui-disclosure-panel-${s}`,...l}=e,[i,n]=N("Disclosure.Panel"),{close:r}=function e(t){let s=(0,o.useContext)(k);if(null===s){let a=Error(`<${t} /> is missing a parent <Disclosure /> component.`);throw Error.captureStackTrace&&Error.captureStackTrace(a,e),a}return s}("Disclosure.Panel"),d=(0,m.T)(t,i.panelRef,e=>{n({type:e?4:5})});(0,o.useEffect)(()=>(n({type:3,panelId:a}),()=>{n({type:3,panelId:null})}),[a,n]);let h=(0,g.oJ)(),x=null!==h?h===g.ZM.Open:0===i.disclosureState,p=(0,o.useMemo)(()=>({open:0===i.disclosureState,close:r}),[i,r]);return o.createElement(I.Provider,{value:i.panelId},(0,c.sY)({ourProps:{ref:d,id:a},theirProps:l,slot:p,defaultTag:"div",features:R,visible:x,name:"Disclosure.Panel"}))})}),P=o.forwardRef(function({title:e,titleId:t,...s},a){return o.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",fill:"none",viewBox:"0 0 24 24",strokeWidth:1.5,stroke:"currentColor","aria-hidden":"true",ref:a,"aria-labelledby":t},s),e?o.createElement("title",{id:t},e):null,o.createElement("path",{strokeLinecap:"round",strokeLinejoin:"round",d:"M19.5 8.25l-7.5 7.5-7.5-7.5"}))});var H=[{question:"How much time do I need to invest to try actuated?",answer:'You probably need to set aside 30 minutes to follow our quickstart guide and get your builds running on actuated. For regular Intel/AMD builds, edit your workflow YAML and change the runs-on field to either "actuated" or "actuated-aarch64".'},{question:"Why do I have to register my interest?",answer:"Whilst we have customers live in production and use actuated ourselves at OpenFaaS Ltd, we want to make sure we can support your team and rank which features you want to see coming on the roadmap. If you have budget for our service, it's very likely that we will accept your team into the pilot."},{question:"What kind of support do you offer?",answer:"For the pilot, every customer is invited to a Slack channel for collaboration and fast support. We have quite a bit of operational experience with GitHub Actions, Docker and Kubernetes and we're making time to help you tune your builds up to get the most out of them."},{question:"What kinds of machines do I need?",answer:"You can use your own physical servers, nested virtualisation with cloud VMs or rent instances paid by the hour.",link:"https://docs.actuated.dev/add-agent/"},{question:"Can we turn machines off overnight to save money?",answer:"If you have little to no activity overnight, and want to optimise your costs, you can power cycle your agents with a cron schedule. Actuated will launch VMs for your jobs when the agents are available again."},{question:"Won't GitHub just offer faster runners?",answer:"GitHub do already offer faster runners at a greatly increased cost, but there is currently no Arm support. With actuated's flat-rate billing, you can get much faster speeds for a flat rate price."},{question:"How does actuated compare to Actions Runtime Controller or the stand-alone self-hosted runner?",answer:"You can find a detailed comparison in the FAQ in the docs.",link:"https://docs.actuated.dev/faq"},{question:"How much faster is an ARM build than using hosted runners?",answer:"In our testing of the open source Parca project, we got the build time down from 33 minutes to 1 minute 26s simply by changing to a real ARM runner instead of using QEMU.",link:"/blog/native-arm64-for-github-actions"},{question:"How do I launch jobs in parallel?",answer:"Have a look at the examples in our docs for matrix builds. Each job within the workflow will be launched in a separate, parallel VM.",link:"https://docs.actuated.dev/"},{question:"How much does it cost? What is the right plan for our team?",answer:"For pilot customers, we have unmetered billing, which means you can use as many build minutes as you like, with one flat fee. The initial tier comes with 5 concurrent builds across one host, and as you increase, you get more RAM/CPU per job, more build agents and more parallel jobs."},{question:"How mature is actuated?",answer:"Actuated is built on battle tested technology that's run in production at huge scale by Amazon Web Services (AWS) and GitHub. Our solution is already being used by us and our customers to save time and increase efficiency."},{question:"Where can I find detailed information about actuated?",answer:"We cover most common questions in much more detail over in the FAQ in the docs.",link:"https://docs.actuated.dev/faq"}];function T(){return(0,i.jsx)("div",{className:"bg-gray-50",children:(0,i.jsx)("div",{className:"mx-auto max-w-7xl py-12 px-4 sm:py-16 sm:px-6 lg:px-8",children:(0,i.jsxs)("div",{className:"mx-auto max-w-3xl divide-y-2 divide-gray-200",children:[(0,i.jsx)("h2",{className:"text-center text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl",children:"Frequently asked questions"}),(0,i.jsx)("dl",{className:"mt-6 space-y-6 divide-y divide-gray-200",children:H.map(function(e){return(0,i.jsx)(E,{as:"div",className:"pt-6",children:function(t){var s=t.open;return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("dt",{className:"text-lg",children:(0,i.jsxs)(E.Button,{className:"flex w-full items-start justify-between text-left text-gray-400",children:[(0,i.jsx)("span",{className:"font-medium text-gray-900",children:e.question}),(0,i.jsx)("span",{className:"ml-6 flex h-7 items-center",children:(0,i.jsx)(P,{className:function(){for(var e=arguments.length,t=Array(e),s=0;s<e;s++)t[s]=arguments[s];return t.filter(Boolean).join(" ")}(s?"-rotate-180":"rotate-0","h-6 w-6 transform"),"aria-hidden":"true"})})]})}),(0,i.jsx)(E.Panel,{as:"dd",className:"mt-2 pr-12",children:(0,i.jsxs)("p",{className:"text-base text-gray-500",children:[e.answer," ",e.link?(0,i.jsx)("a",{href:e.link,className:"text-blue-500 underline",children:"Learn more"}):""," "]})})]})}},e.question)})})]})})})}var D=s(5995),z=s(8097),q=s(2827),B=s(3707);let L=o.forwardRef(function({title:e,titleId:t,...s},a){return o.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:a,"aria-labelledby":t},s),e?o.createElement("title",{id:t},e):null,o.createElement("path",{fillRule:"evenodd",d:"M1 4a1 1 0 011-1h16a1 1 0 011 1v8a1 1 0 01-1 1H2a1 1 0 01-1-1V4zm12 4a3 3 0 11-6 0 3 3 0 016 0zM4 9a1 1 0 100-2 1 1 0 000 2zm13-1a1 1 0 11-2 0 1 1 0 012 0zM1.75 14.5a.75.75 0 000 1.5c4.417 0 8.693.603 12.749 1.73 1.111.309 2.251-.512 2.251-1.696v-.784a.75.75 0 00-1.5 0v.784a.272.272 0 01-.35.25A49.043 49.043 0 001.75 14.5z",clipRule:"evenodd"}))}),W=o.forwardRef(function({title:e,titleId:t,...s},a){return o.createElement("svg",Object.assign({xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 20 20",fill:"currentColor","aria-hidden":"true",ref:a,"aria-labelledby":t},s),e?o.createElement("title",{id:t},e):null,o.createElement("path",{d:"M4.464 3.162A2 2 0 016.28 2h7.44a2 2 0 011.816 1.162l1.154 2.5c.067.145.115.291.145.438A3.508 3.508 0 0016 6H4c-.288 0-.568.035-.835.1.03-.147.078-.293.145-.438l1.154-2.5z"}),o.createElement("path",{fillRule:"evenodd",d:"M2 9.5a2 2 0 012-2h12a2 2 0 110 4H4a2 2 0 01-2-2zm13.24 0a.75.75 0 01.75-.75H16a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V9.5zm-2.25-.75a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75H13a.75.75 0 00.75-.75V9.5a.75.75 0 00-.75-.75h-.01zM2 15a2 2 0 012-2h12a2 2 0 110 4H4a2 2 0 01-2-2zm13.24 0a.75.75 0 01.75-.75H16a.75.75 0 01.75.75v.01a.75.75 0 01-.75.75h-.01a.75.75 0 01-.75-.75V15zm-2.25-.75a.75.75 0 00-.75.75v.01c0 .414.336.75.75.75H13a.75.75 0 00.75-.75V15a.75.75 0 00-.75-.75h-.01z",clipRule:"evenodd"}))});function O(){return(0,i.jsxs)("div",{id:"solutions",className:"bg-white py-5 sm:py-5 lg:py-10",children:[(0,i.jsxs)("div",{className:"mx-auto mt-10 mb-10 max-w-xl px-6 lg:max-w-7xl lg:px-8",children:[(0,i.jsx)("p",{className:"mt-6 mx-10 text-2xl font-semibold leading-8 tracking-tight text-gray-900",children:"All about speed and efficiency."}),(0,i.jsxs)("p",{className:"mt-6 mx-10 text-base leading-7 text-gray-600 text-justify",children:["Learn what friction actuated solves and how it compares to other solutions: ",(0,i.jsx)("a",{className:"text-blue-500 underline",href:"https://blog.alexellis.io/blazing-fast-ci-with-microvms/",children:"Read the announcement"})]})]}),(0,i.jsxs)("div",{className:"mx-auto max-w-xl px-6 lg:max-w-7xl lg:px-8",children:[(0,i.jsx)("h2",{className:"sr-only",children:"Blazing fast CI."}),(0,i.jsx)("dl",{className:"grid grid-cols-1 lg:grid-cols-1",children:(0,i.jsxs)("div",{className:"mx-10",children:[(0,i.jsxs)("dt",{children:[(0,i.jsx)("div",{className:"flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white",children:(0,i.jsx)(q.Z,{className:"h-8 w-8","aria-hidden":"true"})}),(0,i.jsx)("p",{className:"mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900",children:"Blazing fast CI"})]}),(0,i.jsxs)("dd",{className:"mt-2 text-base leading-7 text-gray-600 text-justify",children:[(0,i.jsx)("p",{className:"mb-2",children:"Many teams that we interviewed told us that they have 5-30 people committing regularly throughout the day, with a 20-30 minute build team time. That delay made their team frustrated and distracted as they task switched."}),(0,i.jsx)("p",{className:"mb-2",children:"The first thing you'll notice when you switch to actuated, is just how fast your jobs launch, followed up by the processing power of bare-metal, which is several times faster than GitHub's hosted runners."}),(0,i.jsx)("p",{children:"If you deal with large base images for Docker builds, then you'll benefit from our pull through cache solution, that'll mean common images can be pulled directly from localhost instead of the public Internet."})]})]},"fast-feature")})]}),(0,i.jsxs)("div",{className:"mx-auto max-w-xl px-6 lg:max-w-7xl lg:px-8",children:[(0,i.jsx)("h2",{className:"sr-only",children:"Run directly within your datacenter."}),(0,i.jsx)("dl",{className:"grid grid-cols-1 lg:grid-cols-1",children:(0,i.jsxs)("div",{className:"mx-10",children:[(0,i.jsxs)("dt",{children:[(0,i.jsx)("div",{className:"flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white",children:(0,i.jsx)(W,{className:"h-8 w-8","aria-hidden":"true"})}),(0,i.jsx)("p",{className:"mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900",children:"Run directly within your datacenter"})]}),(0,i.jsxs)("dd",{className:"mt-2 text-base leading-7 text-gray-600 text-justify",children:[(0,i.jsx)("p",{className:"mb-2",children:"If you work with large container images or datasets, then you'll benefit from having your CI run with direct local network access to your internal network."}),(0,i.jsx)("p",{className:"mb-2",children:"This is not possible with hosted runners, and this is crucial for one of our customers who can regularly saturate a 10GbE link during GitHub Actions runs."}),(0,i.jsx)("p",{className:"mb-2",children:"Any use of VPNs will incur significant bandwidth costs along with being capped on speed."})]})]},"fast-feature")})]}),(0,i.jsxs)("div",{className:"mx-auto mt-5 max-w-xl px-6 lg:max-w-7xl lg:px-8",children:[(0,i.jsx)("h2",{className:"sr-only",children:"ARM / M1 from Dev to Production."}),(0,i.jsx)("dl",{className:"grid grid-cols-1 lg:grid-cols-1",children:(0,i.jsxs)("div",{className:"mx-10",children:[(0,i.jsxs)("dt",{children:[(0,i.jsx)("div",{className:"flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white",children:(0,i.jsx)(B.Z,{className:"h-8 w-8","aria-hidden":"true"})}),(0,i.jsx)("p",{className:"mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900",children:"ARM from dev to production"})]}),(0,i.jsxs)("dd",{className:"mt-2 text-base leading-7 text-gray-600 text-justify",children:[(0,i.jsx)("p",{className:"mb-2",children:"The Apple M1 has made local developers much more productive. Teams we interviewed told us their code builds in 1-2 minutes locally, but takes more than 30 minutes with GitHub's runners."}),(0,i.jsx)("p",{children:"When you develop with Apple's M1 locally using Docker, you're running a 64-bit ARM Linux VM, with actuated you can build in the same environment for CI. This reduces friction, but also opens the doors to deploy to more powerful machines in production like AWS Graviton and Ampere servers."})]})]},"arm-feature")})]}),(0,i.jsxs)("div",{className:"mx-auto mt-5 max-w-xl px-6 lg:max-w-7xl lg:px-8",children:[(0,i.jsx)("h2",{className:"sr-only",children:"Completely private CI."}),(0,i.jsx)("dl",{className:"grid grid-cols-1 lg:grid-cols-1",children:(0,i.jsxs)("div",{className:"mx-10",children:[(0,i.jsxs)("dt",{children:[(0,i.jsx)("div",{className:"flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white",children:(0,i.jsx)(D.Z,{className:"h-8 w-8","aria-hidden":"true"})}),(0,i.jsx)("p",{className:"mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900",children:"Completely private CI"})]}),(0,i.jsxs)("dd",{className:"mt-2 text-base leading-7 text-gray-600 text-justify",children:[(0,i.jsx)("p",{className:"mb-2",children:"Actuated uses a hybrid model that you bring bare-metal machines with a bare Operating System, and we do everything else."}),(0,i.jsx)("p",{children:"Your jobs run on either your own machines or cloud instances in your own account, isolated in speedy Firecracker MicroVMs and an immutable filesystem, that we keep up to date and rebuild regularly."})]})]},"isolated-feature")})]}),(0,i.jsxs)("div",{className:"mx-auto mt-5 max-w-xl px-6 lg:max-w-7xl lg:px-8",children:[(0,i.jsx)("h2",{className:"sr-only",children:"Live debugging via SSH."}),(0,i.jsx)("dl",{className:"grid grid-cols-1 lg:grid-cols-1",children:(0,i.jsxs)("div",{className:"mx-10",children:[(0,i.jsxs)("dt",{children:[(0,i.jsx)("div",{className:"flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white",children:(0,i.jsx)(z.Z,{className:"h-8 w-8","aria-hidden":"true"})}),(0,i.jsx)("p",{className:"mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900",children:"Live debugging via SSH"})]}),(0,i.jsxs)("dd",{className:"mt-2 text-base leading-7 text-gray-600 text-justify",children:[(0,i.jsx)("p",{className:"mb-2",children:'We heard from many teams that they missed CircleCI\'s "debug this job" button, so we built it for you.'}),(0,i.jsx)("p",{children:"We realise you won't debug your jobs on a regular basis, but when you are stuck, and have to wait 15-20 minutes to get to the line you've changed in a job, debugging with a terminal can save you hours. Check if this feature is included in your tier."})]})]},"debug-feature")})]}),(0,i.jsxs)("div",{className:"mx-auto mt-5 max-w-xl px-6 lg:max-w-7xl lg:px-8",children:[(0,i.jsx)("h2",{className:"sr-only",children:"Flat rate billing."}),(0,i.jsx)("dl",{className:"grid grid-cols-1 lg:grid-cols-1",children:(0,i.jsxs)("div",{className:"mx-10",children:[(0,i.jsxs)("dt",{children:[(0,i.jsx)("div",{className:"flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-500 text-white",children:(0,i.jsx)(L,{className:"h-8 w-8","aria-hidden":"true"})}),(0,i.jsx)("p",{className:"mt-6 text-lg font-semibold leading-8 tracking-tight text-gray-900",children:"Flat rate billing"})]}),(0,i.jsxs)("dd",{className:"mt-2 text-base leading-7 text-gray-600 text-justify",children:[(0,i.jsx)("p",{className:"mb-2",children:"Most small teams we spoke to were already spending 1000-1500 USD/mo on overage charges on GitHub Actions for the slower hosted runners."}),(0,i.jsx)("p",{className:"mb-2",children:"This doesn't factor in the long delays that your team is facing, and with engineering salaries at an all time high, we're talking about 100-300 USD / hour for every hour wasted, per person within your team."}),(0,i.jsx)("p",{children:"With actuated, you can use as many build minutes as you need, with a predictable flat-rate charge per month. There's no commitment beyond a month, so you can cancel at any time if you want to go back to slower builds. On top of that, your team will be less distracted by task switching."})]})]},"debug-feature")})]})]})}function G(){return(0,i.jsx)("div",{className:"bg-white",children:(0,i.jsx)("div",{className:"mx-auto max-w-7xl py-16 px-4 sm:px-6 lg:px-8",children:(0,i.jsxs)("div",{className:"overflow-hidden rounded-lg bg-indigo-700 shadow-xl lg:grid lg:grid-cols-2 lg:gap-4",children:[(0,i.jsx)("div",{className:"px-6 pt-10 pb-12 sm:px-16 sm:pt-16 lg:py-16 lg:pr-0 xl:py-20 xl:px-20",children:(0,i.jsxs)("div",{className:"lg:self-center",children:[(0,i.jsx)("h2",{className:"text-3xl font-bold tracking-tight text-white sm:text-4xl",children:(0,i.jsx)("span",{className:"block",children:"Ready to go faster?"})}),(0,i.jsx)("p",{className:"mt-4 text-lg leading-6 text-indigo-200",children:"The minimum commitment is one month. You can cancel any time if you don't see a benefit to productivity."}),(0,i.jsx)("a",{href:"https://docs.google.com/forms/d/e/1FAIpQLScA12IGyVFrZtSAp2Oj24OdaSMloqARSwoxx3AZbQbs0wpGww/viewform",className:"mt-8 inline-flex items-center rounded-md border border-transparent bg-white px-5 py-3 text-base font-medium text-indigo-600 shadow hover:bg-indigo-50",children:"Make your builds faster today"})]})}),(0,i.jsx)("div",{className:"aspect-w-5 aspect-h-3 -mt-6 md:aspect-w-2 md:aspect-h-1",children:(0,i.jsx)("img",{className:"translate-x-6 translate-y-6 transform rounded-md object-cover object-left-top sm:translate-x-16 lg:translate-y-20",src:"/images/k3sup.png",alt:"Matrix build with k3sup"})})]})})})}function F(){return(0,i.jsx)("section",{className:"bg-indigo-800",children:(0,i.jsxs)("div",{className:"mx-auto max-w-7xl md:grid md:grid-cols-2 md:px-6 lg:px-8",children:[(0,i.jsxs)("div",{className:"py-12 px-4 sm:px-6 md:flex md:flex-col md:border-r md:border-indigo-900 md:py-16 md:pl-0 md:pr-10 lg:pr-16",children:[(0,i.jsx)("div",{className:"md:flex-shrink-0",children:(0,i.jsx)("img",{className:"h-12",src:"/images/Riskfuel-logo-blue.png",alt:"Tuple"})}),(0,i.jsxs)("blockquote",{className:"mt-6 md:flex md:flex-grow md:flex-col",children:[(0,i.jsxs)("div",{className:"relative text-lg font-medium text-white md:flex-grow",children:[(0,i.jsx)("svg",{className:"absolute top-0 left-0 h-8 w-8 -translate-x-3 -translate-y-2 transform text-indigo-600",fill:"currentColor",viewBox:"0 0 32 32","aria-hidden":"true",children:(0,i.jsx)("path",{d:"M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"})}),(0,i.jsx)("p",{className:"relative",children:"We've been piloting Actuated recently. It only took 30s create 5x isolated VMs, run the jobs and tear them down again inside our on-prem environment (no Docker socket mounting shenanigans)! Pretty impressive stuff."})]}),(0,i.jsx)("footer",{className:"mt-8",children:(0,i.jsxs)("div",{className:"flex items-start",children:[(0,i.jsx)("div",{className:"inline-flex flex-shrink-0 rounded-full border-2 border-white",children:(0,i.jsx)("img",{className:"h-12 w-12 rounded-full",src:"/images/addison.jpg",alt:""})}),(0,i.jsxs)("div",{className:"ml-4",children:[(0,i.jsx)("div",{className:"text-base font-medium text-white",children:"Addison van den Hoeven"}),(0,i.jsx)("div",{className:"text-base font-medium text-indigo-200",children:"DevOps Lead, Riskfuel"})]})]})})]})]}),(0,i.jsxs)("div",{className:"border-t-2 border-indigo-900 py-12 px-4 sm:px-6 md:border-t-0 md:border-l md:py-16 md:pr-0 md:pl-10 lg:pl-16",children:[(0,i.jsx)("div",{className:"md:flex-shrink-0",children:(0,i.jsx)("img",{className:"h-12",src:"/images/suse.png",alt:"SUSE"})}),(0,i.jsxs)("blockquote",{className:"mt-6 md:flex md:flex-grow md:flex-col",children:[(0,i.jsxs)("div",{className:"relative text-lg font-medium text-white md:flex-grow",children:[(0,i.jsx)("svg",{className:"absolute top-0 left-0 h-8 w-8 -translate-x-3 -translate-y-2 transform text-indigo-600",fill:"currentColor",viewBox:"0 0 32 32",children:(0,i.jsx)("path",{d:"M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z"})}),(0,i.jsx)("p",{className:"relative",children:"This is great, perfect for jobs that take forever on normal GitHub runners. I love what Alex is doing here."})]}),(0,i.jsx)("footer",{className:"mt-8",children:(0,i.jsxs)("div",{className:"flex items-start",children:[(0,i.jsx)("div",{className:"inline-flex flex-shrink-0 rounded-full border-2 border-white",children:(0,i.jsx)("img",{className:"h-12 w-12 rounded-full",src:"/images/richardcase.jpg",alt:""})}),(0,i.jsxs)("div",{className:"ml-4",children:[(0,i.jsx)("div",{className:"text-base font-medium text-white",children:"Richard Case"}),(0,i.jsx)("div",{className:"text-base font-medium text-indigo-200",children:"Principal Engineer, SUSE"})]})]})})]})]})]})})}function V(){return(0,i.jsx)("section",{className:"overflow-hidden bg-gray-50 py-12 md:py-20 lg:py-24",children:(0,i.jsxs)("div",{className:"relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8",children:[(0,i.jsxs)("svg",{className:"absolute top-full right-full translate-x-1/3 -translate-y-1/4 transform lg:translate-x-1/2 xl:-translate-y-1/2",width:404,height:404,fill:"none",viewBox:"0 0 404 404",role:"img","aria-labelledby":"svg-workcation",children:[(0,i.jsx)("title",{id:"svg-workcation",children:"Workcation"}),(0,i.jsx)("defs",{children:(0,i.jsx)("pattern",{id:"ad119f34-7694-4c31-947f-5c9d249b21f3",x:0,y:0,width:20,height:20,patternUnits:"userSpaceOnUse",children:(0,i.jsx)("rect",{x:0,y:0,width:4,height:4,className:"text-gray-200",fill:"currentColor"})})}),(0,i.jsx)("rect",{width:404,height:404,fill:"url(#ad119f34-7694-4c31-947f-5c9d249b21f3)"})]}),(0,i.jsxs)("div",{className:"relative",children:[(0,i.jsx)("svg",{className:"mx-auto h-8",fill:"currentColor",viewBox:"0 0 24 24",children:(0,i.jsx)("path",{fillRule:"evenodd",d:"M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z",clipRule:"evenodd"})}),(0,i.jsxs)("blockquote",{className:"mt-10",children:[(0,i.jsxs)("div",{className:"mx-auto max-w-3xl text-center text-2xl font-medium leading-9 text-gray-900",children:[(0,i.jsx)("p",{children:"“It's cheaper - and less frustrating for your developers — to pay more for better hardware to keep your team on track."}),(0,i.jsx)("p",{children:"The upfront cost for more CPU power pays off over time. And your developers will thank you.”"}),(0,i.jsx)("p",{children:"\xa0"}),(0,i.jsxs)("p",{className:"text-sm",children:["Read the article: ",(0,i.jsx)("a",{className:"hover:underline",href:"https://github.blog/2022-12-08-experiment-the-hidden-costs-of-waiting-on-slow-build-times/",children:"The hidden costs of waiting on slow build times (GitHub.com)"})]})]}),(0,i.jsx)("footer",{className:"mt-8",children:(0,i.jsxs)("div",{className:"md:flex md:items-center md:justify-center",children:[(0,i.jsx)("div",{className:"md:flex-shrink-0",children:(0,i.jsx)("img",{className:"mx-auto h-10 w-10 rounded-full",src:"https://avatars.githubusercontent.com/u/9995618?v=4&s=200",alt:""})}),(0,i.jsxs)("div",{className:"mt-3 text-center md:mt-0 md:ml-4 md:flex md:items-center",children:[(0,i.jsx)("div",{className:"text-base font-medium text-gray-900",children:"Natalie Somersall"}),(0,i.jsx)("svg",{className:"mx-1 hidden h-5 w-5 text-indigo-600 md:block",fill:"currentColor",viewBox:"0 0 20 20",children:(0,i.jsx)("path",{d:"M11 0h3L9 20H6l5-20z"})}),(0,i.jsx)("div",{className:"text-base font-medium text-gray-500",children:"GitHub Staff"})]})]})})]})]})]})})}function U(){return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("div",{children:[(0,i.jsxs)("div",{className:"relative",children:[(0,i.jsx)("div",{className:"absolute inset-x-0 bottom-0 h-1/2 bg-gray-100"}),(0,i.jsx)("div",{className:"mx-auto max-w-7xl sm:px-6 lg:px-8",children:(0,i.jsxs)("div",{className:"relative shadow-xl sm:overflow-hidden sm:rounded-2xl",children:[(0,i.jsxs)("div",{className:"absolute inset-0",children:[(0,i.jsx)("img",{className:"h-full w-full object-cover",src:"https://images.unsplash.com/photo-1521737852567-6949f3f9f2b5?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=2830&q=80&sat=-100",alt:"People working on laptops"}),(0,i.jsx)("div",{className:"absolute inset-0 bg-indigo-700 mix-blend-multiply"})]}),(0,i.jsxs)("div",{className:"relative px-4 py-16 sm:px-6 sm:py-24 lg:py-32 lg:px-8",children:[(0,i.jsxs)("h1",{className:"text-center text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl",children:[(0,i.jsx)("span",{className:"block text-white",children:"Blazing fast build times"}),(0,i.jsx)("span",{className:"block text-indigo-200",children:"keeps the team focused."})]}),(0,i.jsx)("p",{className:"mx-auto mt-6 max-w-lg text-center text-xl text-indigo-200 sm:max-w-3xl",children:"Task switching is a productivity killer, slash those 30 minute builds times for your repos by switching to actuated for blazing fast CI times."}),(0,i.jsx)("div",{className:"mx-auto mt-10 max-w-sm sm:flex sm:max-w-none sm:justify-center",children:(0,i.jsxs)("div",{className:"space-y-4 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-5 sm:space-y-0",children:[(0,i.jsx)(r(),{href:"https://docs.actuated.dev/register/",className:"flex items-center justify-center rounded-md border border-transparent bg-white px-4 py-3 text-base font-medium text-indigo-700 shadow-sm hover:bg-indigo-50 sm:px-8",children:"Get started"}),(0,i.jsx)(r(),{href:"https://www.youtube.com/watch?v=2o28iUC-J1w",className:"flex items-center justify-center rounded-md border border-transparent bg-indigo-500 bg-opacity-60 px-4 py-3 text-base font-medium text-white shadow-sm hover:bg-opacity-70 sm:px-8",children:"Live demo"})]})})]})]})})]}),(0,i.jsx)("div",{className:"bg-gray-100",children:(0,i.jsxs)("div",{className:"mx-auto max-w-7xl py-10 px-4 sm:px-6 lg:px-8",children:[(0,i.jsx)("p",{className:"text-center text-base font-semibold text-gray-500 ",children:"Trusted by a growing number of companies"}),(0,i.jsxs)("div",{className:"mt-6 justify-center grid grid-cols-12 gap-8 md:grid-cols-12 lg:grid-cols-12",children:[(0,i.jsx)("div",{className:"col-span-12 flex justify-center md:col-span-6 lg:col-span-6",children:(0,i.jsx)("img",{className:"h-12",src:"./images/Riskfuel-logo-blue.png",alt:"Riskfuel"})}),(0,i.jsx)("div",{className:"col-span-12 flex justify-center md:col-span-6 lg:col-span-6",children:(0,i.jsx)("img",{className:"h-12",src:"./images/openfaas_light.png",alt:"OpenFaaS"})})]})]})})]}),(0,i.jsx)(O,{}),(0,i.jsx)(F,{}),(0,i.jsx)(T,{}),(0,i.jsx)(V,{}),(0,i.jsx)(G,{})]})}}},function(e){e.O(0,[774,888,179],function(){return e(e.s=5557)}),_N_E=e.O()}]);