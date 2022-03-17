export default {
  en: {
    common: {
      refresh: 'Refresh',
      reload: 'Reload',
      more: 'More',
      close: 'Close',
      retry: 'Retry',
      add: 'Add',
      reset: 'Reset'
    },

    app: {
      name: 'Label UP!',
      error: {
        auth: {
          title: 'Oops!',
          message: 'You\'re not authenticated. Make sure you\'re signed in Confluence and try again.'
        },

        license: {
          title: 'Oops!',
          message: 'There seems to be something wrong with your license. Retry or contact your site administrator.'
        }
      }
    },

    server: {
      error: {
        fetchStatus: 'Failed to fetch current status.',
        requestHints: 'Failed to request hints.',
        fetchLabelsAndHints: 'Failed to fetch labels and hints.',
        addLabels: 'Failed to add selected labels.'
      }
    },

    status: {
      pending: {
        title: 'We\'re on it!',
        description: 'Give us a second, your labels are on the way.'
      },
      error: {
        contentMismatch: {
          title: 'Outdated content',
          description: [
            'You\'re not viewing the current latest version of the page.',
            'Reload the page to continue.'
          ]
        },
        generic: {
          title: 'Oops!'
        }
      }
    },

    dashboard: {
      basic: {
        title: {
          default: 'Our Pick',
          allGood: 'Good job!'
        },
        description: {
          default: 'We suggest you apply these labels to this page.',
          allGood: [
            'Seems like the most important labels are already on the page.',
            'Not enough? Check out some more.'
          ]
        },
        button: {
          apply: 'I want these',
          more: 'More labels'
        }
      },

      advanced: {
        title: 'Labels',
        description: 'Select new labels to add to the page. The top choices have already been pre-selected for you.',
        playground: {
          hints: {
            available: {
              title: 'Suggested labels'
            },
            selected: {
              title: 'Your pick',
              warning: {
                tooMany: 'You can only add {maxSelected} labels at a time.'
              }
            }
          },
          labels: {
            title: 'Currently on page',
            empty: 'It seems there are no labels.'
          }
        },
        tips: [
          'Get better suggestions by using headlines of different levels.',
          'Formatting text on page can help you get better suggestions.',
          'Use panel macros like info to make important pieces stand out.',
          'You can get better suggestions if the text on the page is not too short.'
        ]
      }
    },

    label: {
      relevance: 'Relevance: {relevance}%'
    }
  }
}
