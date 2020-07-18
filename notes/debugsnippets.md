## user camera and avatars

Get user object:

    c = SQUIDSPACE.getLoadedObject("user")[0]

This doesn't work! 

    a = SquidHall.makeAvatar("test", c.position, c.rotation, scene)

This does work:

    SquidHall.makeAvatar("test", new BABYLON.Vector3(12, 1.6, -27), new BABYLON.Vector3(0, 1.57, 0, scene));