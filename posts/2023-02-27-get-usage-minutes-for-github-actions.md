---
title: How to get your usage minutes for GitHub Actions
description: We show you how to get your total usage minutes for GitHub Action
author: Han Verstraete
tags:
- actuated
- githubactions
- metrics

author_img: welteki
image: /images/2023-02-27-get-usage-minutes-for-github-actions/actuated-dashboard-reports.png
date: "2023-02-27"
---

The GitHub UI is very limited, it only gives an overview of the usage minutes in the current billing period. If you need a more detailed overview over a longer time period a report can only be obtained via email.

This report does not include usage for jobs run on self hosted runners. That is why we created a small command line tool: [actions-usage](https://github.com/self-actuated/actions-usage)

The CLI tool allows you to find your total GitHub Actions usage across a givin organisation.

## Get your total GitHub Actions usage

To get the usage over a 30 day period run:

```
$ actions-usage --since 30 --org skatolo --token $(cat ~/pat.txt)

Total repos: 11
Total private repos: 7
Total public repos: 4

Total workflow runs: 55
Total workflow jobs: 68
Total usage: 1h45m37s (106 mins)
```

If you have more than 5000 workflow runs you might run into the rate limits for the GitHub API. A workaround would be to only list jobs for the last 10 days and multiply the result by 3 to give you an estimate.

```bash
actions-usage \
    --since 10 \
    --org skatolo \
    --token $(cat ~/pat.txt)
```

## Conclusion

GitHub only gives you limited info about the usage minutes for you GitHub Actions. Only paid or hosted runners are included in the overview all job runs on self hosted runners are excluded from the statistics.

The [actions-usage](https://github.com/self-actuated/actions-usage) command line tool can help you generate an overview of the total usage minutes including jobs that ran on sel hosted runners.

Actuated records metrics about builds run on the platform and makes these insights available in the dashboard.

These reports include on overview of the total run-time and number of jobs broken down per organisation.

![Usage reports in the actuated dashboard](/images/2023-02-27-get-usage-minutes-for-github-actions/actuated-dashboard-reports.png)
> Usage reports in the Actuated dashboard

We are currently working on expanding these reports to make more information available in the dashboard.

If you are interested in getting more insights in your job runs, [apply for t
he actuated pilot](https://docs.google.com/forms/d/e/1FAIpQLScA12IGyVFrZtSAp2Oj24OdaSMloqARSwoxx3AZbQbs0wpGww/viewform).