module example.com/valid // CheckModulePath: valid module path format

go 1.22.0 // GoVersionPattern: matches go min version constraints

require (
	github.com/google/uuid v1.6.0
	golang.org/x/mod v0.37.0
)

retract v1.0.0 // Published by mistake. RetractAllowNoExplanation: contains the required explanation comment
