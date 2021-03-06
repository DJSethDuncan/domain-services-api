# Domain Services API

An API to return data on domains. 

Accepts two parameters: 
```
domain: String <domain or IP address>
services: Array <geolocation, rdap, reversedns, ping> (Default: ping)
```

Will return data in this format:
```
{
    "geolocation": {...},
    "rdap": {...},
    "reversedns": [<domain>],
    "ping": {...}
}
```

NOTE: This relies on the [Domain Services Cluster](https://github.com/DJSethDuncan/domain-services-cluster) to be running somewhere. Even for tests. 
