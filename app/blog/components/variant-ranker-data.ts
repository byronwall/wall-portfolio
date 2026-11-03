// Generated from `draftably vary` runs on 2026-11-02 (draftably 4847651c). Do not edit by hand.
export const varyRuns = [
  {
    "id": "observability-stack",
    "label": "Observability stack",
    "recommended": "v1",
    "variants": [
      {
        "id": "v0",
        "title": "current",
        "why": "the file as it is",
        "img": "/images/posts/the-prettiest-layout-lost/vary/observability-stack/v0.webp",
        "w": 1207,
        "h": 662,
        "crossings": 3,
        "bends": 29,
        "warnings": 0,
        "moved": 0
      },
      {
        "id": "v1",
        "title": "crossing-penalty=900",
        "why": "keep the layout, route around its 3 crossings harder",
        "img": "/images/posts/the-prettiest-layout-lost/vary/observability-stack/v1.webp",
        "w": 1207,
        "h": 662,
        "crossings": 2,
        "bends": 30,
        "warnings": 0,
        "moved": 0
      },
      {
        "id": "v2",
        "title": "compound-flow down",
        "why": "6 groups, reading down",
        "img": "/images/posts/the-prettiest-layout-lost/vary/observability-stack/v2.webp",
        "w": 1008,
        "h": 1421,
        "crossings": 0,
        "bends": 16,
        "warnings": 0,
        "moved": 622
      },
      {
        "id": "v3",
        "title": "compound-flow right",
        "why": "6 groups, reading right",
        "img": "/images/posts/the-prettiest-layout-lost/vary/observability-stack/v3.webp",
        "w": 1876,
        "h": 694,
        "crossings": 2,
        "bends": 26,
        "warnings": 0,
        "moved": 300
      },
      {
        "id": "v4",
        "title": "soften 5 groups",
        "why": "fewer containers: soften groups web_tier, worker_tier, pipeline, storage, tools",
        "img": "/images/posts/the-prettiest-layout-lost/vary/observability-stack/v4.webp",
        "w": 987,
        "h": 1024,
        "crossings": 6,
        "bends": 26,
        "warnings": 3,
        "moved": 322
      }
    ]
  },
  {
    "id": "data-lakehouse",
    "label": "Data lakehouse",
    "recommended": "v1",
    "variants": [
      {
        "id": "v0",
        "title": "current",
        "why": "the file as it is",
        "img": "/images/posts/the-prettiest-layout-lost/vary/data-lakehouse/v0.webp",
        "w": 892,
        "h": 798,
        "crossings": 4,
        "bends": 25,
        "warnings": 0,
        "moved": 0
      },
      {
        "id": "v1",
        "title": "crossing-penalty=900",
        "why": "keep the layout, route around its 4 crossings harder",
        "img": "/images/posts/the-prettiest-layout-lost/vary/data-lakehouse/v1.webp",
        "w": 892,
        "h": 798,
        "crossings": 2,
        "bends": 28,
        "warnings": 0,
        "moved": 0
      },
      {
        "id": "v2",
        "title": "soften 5 groups",
        "why": "fewer containers: soften groups sources, bronze, silver, gold, consumers",
        "img": "/images/posts/the-prettiest-layout-lost/vary/data-lakehouse/v2.webp",
        "w": 1168,
        "h": 444,
        "crossings": 4,
        "bends": 20,
        "warnings": 0,
        "moved": 356
      },
      {
        "id": "v3",
        "title": "compound-flow down",
        "why": "5 groups, reading down",
        "img": "/images/posts/the-prettiest-layout-lost/vary/data-lakehouse/v3.webp",
        "w": 668,
        "h": 1150,
        "crossings": 4,
        "bends": 30,
        "warnings": 0,
        "moved": 282
      },
      {
        "id": "v4",
        "title": "compound-flow right",
        "why": "5 groups, reading right",
        "img": "/images/posts/the-prettiest-layout-lost/vary/data-lakehouse/v4.webp",
        "w": 972,
        "h": 794,
        "crossings": 4,
        "bends": 31,
        "warnings": 0,
        "moved": 32
      }
    ]
  },
  {
    "id": "rag-assistant",
    "label": "RAG assistant",
    "recommended": "v0",
    "variants": [
      {
        "id": "v0",
        "title": "current",
        "why": "the file as it is",
        "img": "/images/posts/the-prettiest-layout-lost/vary/rag-assistant/v0.webp",
        "w": 1376,
        "h": 723,
        "crossings": 2,
        "bends": 23,
        "warnings": 0,
        "moved": 0
      },
      {
        "id": "v1",
        "title": "compound-flow right",
        "why": "4 groups, reading right",
        "img": "/images/posts/the-prettiest-layout-lost/vary/rag-assistant/v1.webp",
        "w": 1873,
        "h": 571,
        "crossings": 1,
        "bends": 25,
        "warnings": 0,
        "moved": 258
      },
      {
        "id": "v2",
        "title": "compound-flow down",
        "why": "4 groups, reading down",
        "img": "/images/posts/the-prettiest-layout-lost/vary/rag-assistant/v2.webp",
        "w": 1125,
        "h": 961,
        "crossings": 1,
        "bends": 26,
        "warnings": 0,
        "moved": 434
      },
      {
        "id": "v3",
        "title": "flow right",
        "why": "a chain of 9 steps",
        "img": "/images/posts/the-prettiest-layout-lost/vary/rag-assistant/v3.webp",
        "w": 2542,
        "h": 571,
        "crossings": 1,
        "bends": 21,
        "warnings": 0,
        "moved": 325
      },
      {
        "id": "v4",
        "title": "crossing-penalty=900",
        "why": "keep the layout, route around its 2 crossings harder",
        "img": "/images/posts/the-prettiest-layout-lost/vary/rag-assistant/v4.webp",
        "w": 1376,
        "h": 723,
        "crossings": 2,
        "bends": 23,
        "warnings": 0,
        "moved": 0
      }
    ]
  },
  {
    "id": "aws-vpc-network",
    "label": "AWS VPC",
    "recommended": "v0",
    "variants": [
      {
        "id": "v0",
        "title": "current",
        "why": "the file as it is",
        "img": "/images/posts/the-prettiest-layout-lost/vary/aws-vpc-network/v0.webp",
        "w": 1216,
        "h": 1140,
        "crossings": 0,
        "bends": 21,
        "warnings": 0,
        "moved": 0
      },
      {
        "id": "v1",
        "title": "compound-flow down",
        "why": "9 groups, reading down",
        "img": "/images/posts/the-prettiest-layout-lost/vary/aws-vpc-network/v1.webp",
        "w": 1292,
        "h": 1156,
        "crossings": 0,
        "bends": 22,
        "warnings": 0,
        "moved": 177
      },
      {
        "id": "v2",
        "title": "compound-flow right",
        "why": "9 groups, reading right",
        "img": "/images/posts/the-prettiest-layout-lost/vary/aws-vpc-network/v2.webp",
        "w": 1472,
        "h": 1027,
        "crossings": 0,
        "bends": 18,
        "warnings": 0,
        "moved": 172
      },
      {
        "id": "v3",
        "title": "soften 5 groups",
        "why": "fewer containers: soften groups pub_a, priv_a, pub_b, priv_b, region",
        "img": "/images/posts/the-prettiest-layout-lost/vary/aws-vpc-network/v3.webp",
        "w": 1132,
        "h": 972,
        "crossings": 7,
        "bends": 7,
        "warnings": 2,
        "moved": 86
      },
      {
        "id": "v4",
        "title": "soften 4 groups",
        "why": "fewer containers: soften groups pub_a, priv_a, pub_b, priv_b",
        "img": "/images/posts/the-prettiest-layout-lost/vary/aws-vpc-network/v4.webp",
        "w": 1160,
        "h": 1026,
        "crossings": 7,
        "bends": 8,
        "warnings": 2,
        "moved": 50
      }
    ]
  },
  {
    "id": "kubernetes-cluster",
    "label": "Kubernetes cluster",
    "recommended": "v1",
    "variants": [
      {
        "id": "v0",
        "title": "current",
        "why": "the file as it is",
        "img": "/images/posts/the-prettiest-layout-lost/vary/kubernetes-cluster/v0.webp",
        "w": 1367,
        "h": 1247,
        "crossings": 1,
        "bends": 18,
        "warnings": 0,
        "moved": 0
      },
      {
        "id": "v1",
        "title": "compound-flow down",
        "why": "7 groups, reading down",
        "img": "/images/posts/the-prettiest-layout-lost/vary/kubernetes-cluster/v1.webp",
        "w": 658,
        "h": 1564,
        "crossings": 1,
        "bends": 22,
        "warnings": 0,
        "moved": 533
      },
      {
        "id": "v2",
        "title": "compound-flow right",
        "why": "7 groups, reading right",
        "img": "/images/posts/the-prettiest-layout-lost/vary/kubernetes-cluster/v2.webp",
        "w": 1359,
        "h": 1247,
        "crossings": 1,
        "bends": 18,
        "warnings": 0,
        "moved": 87
      },
      {
        "id": "v3",
        "title": "soften 2 groups",
        "why": "fewer containers: soften groups cart_deploy, ns_ops",
        "img": "/images/posts/the-prettiest-layout-lost/vary/kubernetes-cluster/v3.webp",
        "w": 1537,
        "h": 1095,
        "crossings": 1,
        "bends": 18,
        "warnings": 1,
        "moved": 126
      },
      {
        "id": "v4",
        "title": "soften 4 groups",
        "why": "fewer containers: soften groups cart_deploy, ns_ops, ns_shop, ns_data",
        "img": "/images/posts/the-prettiest-layout-lost/vary/kubernetes-cluster/v4.webp",
        "w": 1477,
        "h": 803,
        "crossings": 4,
        "bends": 14,
        "warnings": 4,
        "moved": 235
      }
    ]
  },
  {
    "id": "vary-loop",
    "label": "This post’s own diagram",
    "recommended": "v1",
    "variants": [
      {
        "id": "v0",
        "title": "current",
        "why": "the file as it is",
        "img": "/images/posts/the-prettiest-layout-lost/vary/vary-loop/v0.webp",
        "w": 752,
        "h": 480,
        "crossings": 3,
        "bends": 13,
        "warnings": 0,
        "moved": 0
      },
      {
        "id": "v1",
        "title": "layered right",
        "why": "no groups, reading right",
        "img": "/images/posts/the-prettiest-layout-lost/vary/vary-loop/v1.webp",
        "w": 756,
        "h": 468,
        "crossings": 3,
        "bends": 15,
        "warnings": 0,
        "moved": 14
      },
      {
        "id": "v2",
        "title": "crossing-penalty=900",
        "why": "keep the layout, route around its 3 crossings harder",
        "img": "/images/posts/the-prettiest-layout-lost/vary/vary-loop/v2.webp",
        "w": 793,
        "h": 518,
        "crossings": 0,
        "bends": 15,
        "warnings": 0,
        "moved": 0
      },
      {
        "id": "v3",
        "title": "layered down",
        "why": "no groups, reading down",
        "img": "/images/posts/the-prettiest-layout-lost/vary/vary-loop/v3.webp",
        "w": 566,
        "h": 794,
        "crossings": 0,
        "bends": 11,
        "warnings": 0,
        "moved": 299
      },
      {
        "id": "v4",
        "title": "flow right",
        "why": "a chain of 6 steps",
        "img": "/images/posts/the-prettiest-layout-lost/vary/vary-loop/v4.webp",
        "w": 1412,
        "h": 324,
        "crossings": 0,
        "bends": 15,
        "warnings": 0,
        "moved": 433
      }
    ]
  }
] as const
